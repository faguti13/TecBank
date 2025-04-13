using System.Text.Json;
using System.Security.Cryptography;
using System.Text;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class CuentaService
    {
        private readonly string _dataPath;
        private static readonly object _lock = new object();
        private readonly string _encryptionKey = "TecBankSecretKey123"; // Clave para encriptación

        public CuentaService(IWebHostEnvironment webHostEnvironment)
        {
            _dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data", "cuentas.json");
            // Crear el archivo si no existe
            if (!File.Exists(_dataPath))
            {
                File.WriteAllText(_dataPath, "[]");
            }
        }

        private List<Cuenta> ReadData()
        {
            lock (_lock)
            {
                var jsonString = File.ReadAllText(_dataPath);
                var cuentas = JsonSerializer.Deserialize<List<Cuenta>>(jsonString) ?? new List<Cuenta>();
                
                // Desencriptar los números de cuenta al leerlos
                foreach (var cuenta in cuentas)
                {
                    cuenta.NumeroCuenta = DecryptString(cuenta.NumeroCuenta);
                }
                
                return cuentas;
            }
        }

private void SaveData(List<Cuenta> cuentas)
{
    lock (_lock)
    {
        // Crear copias encriptadas para guardar en el JSON
        var cuentasToSave = cuentas.Select(c => new Cuenta
        {
            Id = c.Id,
            NumeroCuenta = EncryptString(c.NumeroCuenta),
            Descripcion = c.Descripcion,
            Moneda = c.Moneda,
            TipoCuenta = c.TipoCuenta,
            NombreCliente = c.NombreCliente
        }).ToList();

        var options = new JsonSerializerOptions
        {
            WriteIndented = true,
            Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
        };

        var jsonString = JsonSerializer.Serialize(cuentasToSave, options);
        File.WriteAllText(_dataPath, jsonString); 
    }
}


        // Método para encriptar cadenas
        private string EncryptString(string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;
                
            using (var aes = Aes.Create())
            {
                byte[] key = Encoding.UTF8.GetBytes(_encryptionKey);
                Array.Resize(ref key, 32); // Asegurar que la clave tenga 32 bytes (256 bits)
                
                aes.Key = key;
                aes.IV = new byte[16]; // Vector de inicialización de 16 bytes (128 bits) con ceros
                
                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);
                
                using (MemoryStream ms = new MemoryStream())
                {
                    using (CryptoStream cs = new CryptoStream(ms, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter sw = new StreamWriter(cs))
                        {
                            sw.Write(text);
                        }
                    }
                    return Convert.ToBase64String(ms.ToArray());
                }
            }
        }

        // Método para desencriptar cadenas
        private string DecryptString(string encryptedText)
        {
            if (string.IsNullOrEmpty(encryptedText))
                return encryptedText;
                
            try
            {
                byte[] cipherText = Convert.FromBase64String(encryptedText);
                
                using (var aes = Aes.Create())
                {
                    byte[] key = Encoding.UTF8.GetBytes(_encryptionKey);
                    Array.Resize(ref key, 32); // Asegurar que la clave tenga 32 bytes (256 bits)
                    
                    aes.Key = key;
                    aes.IV = new byte[16]; // Vector de inicialización de 16 bytes (128 bits) con ceros
                    
                    ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                    using (MemoryStream ms = new MemoryStream(cipherText))
                    {
                        using (CryptoStream cs = new CryptoStream(ms, decryptor, CryptoStreamMode.Read))
                        {
                            using (StreamReader reader = new StreamReader(cs))
                            {
                                return reader.ReadToEnd();
                            }
                        }
                    }
                }
            }
            catch (FormatException)
            {
                // Si no está en formato Base64, probablemente no está encriptado
                return encryptedText;
            }
            catch (CryptographicException)
            {
                // Si hay un error de desencriptación, devolver el texto original
                return encryptedText;
            }
        }

        public List<Cuenta> GetAll()
        {
            return ReadData();
        }

        public Cuenta? GetById(int id)
        {
            var cuentas = ReadData();
            return cuentas.FirstOrDefault(c => c.Id == id);
        }
        
        public List<Cuenta> GetByNombreCliente(string nombreCliente)
        {
            var cuentas = ReadData();
            return cuentas.Where(c => c.NombreCliente.Contains(nombreCliente, StringComparison.OrdinalIgnoreCase)).ToList();
        }

        public Cuenta Create(Cuenta cuenta)
        {
            var cuentas = ReadData();
            cuenta.Id = cuentas.Count > 0 ? cuentas.Max(c => c.Id) + 1 : 1;
            cuentas.Add(cuenta);
            SaveData(cuentas);
            return cuenta;
        }

        public bool Update(int id, Cuenta cuenta)
        {
            var cuentas = ReadData();
            var index = cuentas.FindIndex(c => c.Id == id);
            if (index == -1) return false;

            cuenta.Id = id;
            cuentas[index] = cuenta;
            SaveData(cuentas);
            return true;
        }

        public bool Delete(int id)
        {
            var cuentas = ReadData();
            var cuenta = cuentas.FirstOrDefault(c => c.Id == id);
            if (cuenta == null) return false;

            cuentas.Remove(cuenta);
            SaveData(cuentas);
            return true;
        }
    }
}
using System.Text.Json;
using System.Security.Cryptography;
using System.Text;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class CuentaService
    {
        
        private readonly string _cuentaPath; 
        private static readonly object _lock = new object();
        private readonly string _encryptionKey = "TecBankSecretKey123"; // Clave para encriptación
        private readonly JsonSerializerOptions _jsonOptions;

       public CuentaService(IWebHostEnvironment webHostEnvironment)
        {
            var dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data");
            _cuentaPath = Path.Combine(dataPath, "cuentas.json"); 
            _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

            // Crear archivo si no existe
            if (!Directory.Exists(dataPath))
                Directory.CreateDirectory(dataPath);

            if (!File.Exists(_cuentaPath)) 
                File.WriteAllText(_cuentaPath, "[]");
        }
     

        private List<Cuenta> ReadData()
        {
            lock (_lock)
            {
                var jsonString = File.ReadAllText(_cuentaPath);
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
        var jsonString = JsonSerializer.Serialize(cuentas, _jsonOptions);
        File.WriteAllText(_cuentaPath, jsonString); 
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

        public Cuenta? GetByNumeroCuenta(string numeroCuenta)
        {
            var cuentas = ReadData();
            return cuentas.FirstOrDefault(c => c.NumeroCuenta == numeroCuenta);
        }
        
        public List<Cuenta> GetByClienteId(string cedula)
        {
            var cuentas = ReadData();
            return cuentas.Where(c => c.CedulaCliente == cedula).ToList();
        }

        public Cuenta Create(Cuenta cuenta)
        {
            var cuentas = ReadData();
            cuenta.Id = cuentas.Count > 0 ? cuentas.Max(c => c.Id) + 1 : 1;
            
            // Asegurar que todas las propiedades requeridas estén establecidas
            if (string.IsNullOrEmpty(cuenta.NumeroCuenta))
                throw new ArgumentException("El número de cuenta es requerido");
            if (string.IsNullOrEmpty(cuenta.Descripcion))
                throw new ArgumentException("La descripción es requerida");
            if (string.IsNullOrEmpty(cuenta.Moneda))
                cuenta.Moneda = "Colones";
            if (string.IsNullOrEmpty(cuenta.TipoCuenta))
                cuenta.TipoCuenta = "Ahorros";
            if (string.IsNullOrEmpty(cuenta.CedulaCliente))
                throw new ArgumentException("La cédula del cliente es requerida");

            cuentas.Add(cuenta);
            SaveData(cuentas);
            return cuenta;
        }

        public bool Update(int id, Cuenta cuenta)
        {
            var cuentas = ReadData();
            var index = cuentas.FindIndex(c => c.Id == id);
            if (index == -1) return false;

            // Asegurar que todas las propiedades requeridas estén establecidas
            if (string.IsNullOrEmpty(cuenta.NumeroCuenta))
                throw new ArgumentException("El número de cuenta es requerido");
            if (string.IsNullOrEmpty(cuenta.Descripcion))
                throw new ArgumentException("La descripción es requerida");
            if (string.IsNullOrEmpty(cuenta.Moneda))
                cuenta.Moneda = "Colones";
            if (string.IsNullOrEmpty(cuenta.TipoCuenta))
                cuenta.TipoCuenta = "Ahorros";
            if (string.IsNullOrEmpty(cuenta.CedulaCliente))
                throw new ArgumentException("La cédula del cliente es requerida");

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
using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class CuentaService
    {
        private readonly string _cuentaPath;
        private static readonly object _lock = new object();
        private readonly JsonSerializerOptions _jsonOptions;

        public CuentaService(IWebHostEnvironment webHostEnvironment)
        {
            var dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data");
            _cuentaPath = Path.Combine(dataPath, "cuentas.json");
            _jsonOptions = new JsonSerializerOptions { WriteIndented = true };

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
                return JsonSerializer.Deserialize<List<Cuenta>>(jsonString) ?? new List<Cuenta>();
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

        public List<Cuenta> GetAll()
        {
            return ReadData();
        }

        public Cuenta? GetById(int id)
        {
            var cuentas = ReadData();
            return cuentas.FirstOrDefault(c => c.Id == id);
        }

        public List<Cuenta> GetByClienteId(string cedula)
        {
            var cuentas = ReadData();
            return cuentas.Where(c => c.CedulaCliente == cedula).ToList();
        }

        public Cuenta? GetByNumeroCuenta(string numeroCuenta)
        {
            var cuentas = ReadData();
            return cuentas.FirstOrDefault(c => c.NumeroCuenta == numeroCuenta);
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
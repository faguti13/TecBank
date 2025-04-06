using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class CuentaService
    {
        private readonly string _dataPath;
        private static readonly object _lock = new object();

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
                return JsonSerializer.Deserialize<List<Cuenta>>(jsonString) ?? new List<Cuenta>();
            }
        }

        private void SaveData(List<Cuenta> cuentas)
        {
            lock (_lock)
            {
                var jsonString = JsonSerializer.Serialize(cuentas, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_dataPath, jsonString);
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
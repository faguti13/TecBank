using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class RolService
    {
        private readonly string _dataPath;
        private static readonly object _lock = new object();

        public RolService(IWebHostEnvironment webHostEnvironment)
        {
            _dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data", "roles.json");
            // Crear el archivo si no existe
            if (!File.Exists(_dataPath))
            {
                File.WriteAllText(_dataPath, "[]");
            }
        }

        private List<Rol> ReadData()
        {
            lock (_lock)
            {
                var jsonString = File.ReadAllText(_dataPath);
                return JsonSerializer.Deserialize<List<Rol>>(jsonString) ?? new List<Rol>();
            }
        }

        private void SaveData(List<Rol> roles)
        {
            lock (_lock)
            {
                var jsonString = JsonSerializer.Serialize(roles, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_dataPath, jsonString);
            }
        }

        public List<Rol> GetAll()
        {
            return ReadData();
        }

        public Rol? GetById(int id)
        {
            var roles = ReadData();
            return roles.FirstOrDefault(r => r.Id == id);
        }

        public Rol Create(Rol rol)
        {
            var roles = ReadData();
            rol.Id = roles.Count > 0 ? roles.Max(r => r.Id) + 1 : 1;
            roles.Add(rol);
            SaveData(roles);
            return rol;
        }

        public bool Update(int id, Rol rol)
        {
            var roles = ReadData();
            var index = roles.FindIndex(r => r.Id == id);
            if (index == -1) return false;

            rol.Id = id;
            roles[index] = rol;
            SaveData(roles);
            return true;
        }

        public bool Delete(int id)
        {
            var roles = ReadData();
            var rol = roles.FirstOrDefault(r => r.Id == id);
            if (rol == null) return false;

            roles.Remove(rol);
            SaveData(roles);
            return true;
        }
    }
} 
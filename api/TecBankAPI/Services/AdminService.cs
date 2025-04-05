using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public interface IAdminService
    {
        Task<Admin?> Login(string usuario, string password);
        Task<Admin> Register(AdminRegisterRequest request);
        Task SaveAdmins();
        Task<List<Admin>> GetAllAdmins();
    }

    public class AdminService : IAdminService
    {
        private List<Admin> _admins;
        private readonly string _dataPath = "Data/admins.json";
        private readonly JsonSerializerOptions _jsonOptions;

        public AdminService()
        {
            _jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = null
            };
            _admins = LoadAdmins();
        }

        private List<Admin> LoadAdmins()
        {
            if (!File.Exists(_dataPath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_dataPath)!);
                // Crear admin por defecto si no existe ninguno
                var defaultAdmin = new Admin
                {
                    Usuario = "admin",
                    Password = "admin123",
                    Nombre = "Administrador",
                    Rol = "SuperAdmin"
                };
                _admins = new List<Admin> { defaultAdmin };
                SaveAdmins().Wait();
                return _admins;
            }

            var json = File.ReadAllText(_dataPath);
            return JsonSerializer.Deserialize<List<Admin>>(json, _jsonOptions) ?? new List<Admin>();
        }

        public async Task SaveAdmins()
        {
            var json = JsonSerializer.Serialize(_admins, _jsonOptions);
            await File.WriteAllTextAsync(_dataPath, json);
        }

        public async Task<Admin?> Login(string usuario, string password)
        {
            var admin = _admins.FirstOrDefault(a => 
                a.Usuario.Equals(usuario, StringComparison.OrdinalIgnoreCase));

            if (admin == null || !admin.VerifyPassword(password))
            {
                return null;
            }

            return admin;
        }

        public async Task<Admin> Register(AdminRegisterRequest request)
        {
            if (_admins.Any(a => a.Usuario.Equals(request.Usuario, StringComparison.OrdinalIgnoreCase)))
            {
                throw new Exception("El usuario administrador ya existe");
            }

            var admin = new Admin
            {
                Usuario = request.Usuario,
                Password = request.Password,
                Nombre = request.Nombre,
                Rol = request.Rol
            };

            _admins.Add(admin);
            await SaveAdmins();

            return admin;
        }

        public async Task<List<Admin>> GetAllAdmins()
        {
            return _admins;
        }
    }
} 
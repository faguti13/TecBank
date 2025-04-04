using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public interface IAuthService
    {
        Task<Cliente?> Login(string usuario, string password);
        Task<Cliente> Register(RegisterRequest request);
        Task SaveClientes();
    }

    public class AuthService : IAuthService
    {
        private List<Cliente> _clientes;
        private readonly string _dataPath = "Data/clientes.json";
        private readonly JsonSerializerOptions _jsonOptions;

        public AuthService()
        {
            _jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = null
            };
            _clientes = LoadClientes();
        }

        private List<Cliente> LoadClientes()
        {
            if (!File.Exists(_dataPath))
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_dataPath)!);
                return new List<Cliente>();
            }

            var json = File.ReadAllText(_dataPath);
            return JsonSerializer.Deserialize<List<Cliente>>(json, _jsonOptions) ?? new List<Cliente>();
        }

        public async Task SaveClientes()
        {
            var json = JsonSerializer.Serialize(_clientes, _jsonOptions);
            await File.WriteAllTextAsync(_dataPath, json);
        }

        public async Task<Cliente?> Login(string usuario, string password)
        {
            var cliente = _clientes.FirstOrDefault(c => 
                c.Usuario.Equals(usuario, StringComparison.OrdinalIgnoreCase));

            if (cliente == null || !cliente.VerifyPassword(password))
            {
                return null;
            }

            return cliente;
        }

        public async Task<Cliente> Register(RegisterRequest request)
        {
            if (_clientes.Any(c => c.Usuario.Equals(request.Usuario, StringComparison.OrdinalIgnoreCase)))
            {
                throw new Exception("El usuario ya existe");
            }

            if (_clientes.Any(c => c.Cedula == request.Cedula))
            {
                throw new Exception("La cédula ya está registrada");
            }

            var cliente = new Cliente
            {
                Cedula = request.Cedula,
                Nombre = request.Nombre,
                Apellido1 = request.Apellido1,
                Apellido2 = request.Apellido2,
                Direccion = request.Direccion,
                Telefono = request.Telefono,
                Usuario = request.Usuario,
                Password = request.Password,
                TipoCliente = request.TipoCliente
            };

            _clientes.Add(cliente);
            await SaveClientes();

            return cliente;
        }
    }
} 
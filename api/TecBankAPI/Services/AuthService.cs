using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public interface IAuthService
    {
        Task<Cliente> Login(LoginRequest request);
        Task<Cliente> Register(RegisterRequest request);
    }

    public class AuthService : IAuthService
    {
        private readonly string _clientesFilePath;
        private static readonly object _lock = new object();
        private readonly JsonSerializerOptions _jsonOptions;

        public AuthService()
        {
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Data");
            Directory.CreateDirectory(basePath);
            _clientesFilePath = Path.Combine(basePath, "clientes.json");
            _jsonOptions = new JsonSerializerOptions
            {
                WriteIndented = true
            };

            if (!File.Exists(_clientesFilePath))
            {
                File.WriteAllText(_clientesFilePath, "[]");
            }
        }

        public async Task<Cliente> Login(LoginRequest request)
        {
            lock (_lock)
            {
                var clientes = ObtenerClientes();
                var cliente = clientes.FirstOrDefault(c => 
                    c.Usuario.Equals(request.Usuario, StringComparison.OrdinalIgnoreCase) &&
                    c.Password == request.Password);

                if (cliente == null)
                {
                    throw new Exception("Usuario o contraseña incorrectos");
                }

                return cliente;
            }
        }

        public async Task<Cliente> Register(RegisterRequest request)
        {
            lock (_lock)
            {
                var clientes = ObtenerClientes();

                if (clientes.Any(c => c.Usuario.Equals(request.Usuario, StringComparison.OrdinalIgnoreCase)))
                {
                    throw new Exception("El usuario ya existe");
                }

                if (clientes.Any(c => c.Cedula == request.Cedula))
                {
                    throw new Exception("Ya existe un usuario con esa cédula");
                }

                var cliente = new Cliente
                {
                    Id = clientes.Count > 0 ? clientes.Max(c => c.Id) + 1 : 1,
                    Usuario = request.Usuario,
                    Password = request.Password,
                    Nombre = request.Nombre,
                    Apellido1 = request.Apellido1,
                    Apellido2 = request.Apellido2,
                    Cedula = request.Cedula,
                    Direccion = request.Direccion,
                    Telefono = request.Telefono,
                    Email = request.Email,
                    TipoCliente = request.TipoCliente
                };

                clientes.Add(cliente);
                GuardarClientes(clientes);

                return cliente;
            }
        }

        private List<Cliente> ObtenerClientes()
        {
            var json = File.ReadAllText(_clientesFilePath);
            return JsonSerializer.Deserialize<List<Cliente>>(json, _jsonOptions) ?? new List<Cliente>();
        }

        private void GuardarClientes(List<Cliente> clientes)
        {
            var json = JsonSerializer.Serialize(clientes, _jsonOptions);
            File.WriteAllText(_clientesFilePath, json);
        }
    }
} 
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

        public AuthService()
        {
            var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Data");
            Directory.CreateDirectory(basePath);
            _clientesFilePath = Path.Combine(basePath, "clientes.json");
        }

        public async Task<Cliente> Login(LoginRequest request)
        {
            lock (_lock)
            {
                if (!File.Exists(_clientesFilePath))
                {
                    throw new Exception("No se encontró el archivo de clientes");
                }

                var json = File.ReadAllText(_clientesFilePath);
                var clientes = JsonSerializer.Deserialize<List<Cliente>>(json) ?? new List<Cliente>();
                var cliente = clientes.FirstOrDefault(c => c.Usuario == request.Usuario);

                if (cliente == null || !cliente.VerifyPassword(request.Password))
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
                if (!File.Exists(_clientesFilePath))
                {
                    File.WriteAllText(_clientesFilePath, "[]");
                }

                var json = File.ReadAllText(_clientesFilePath);
                var clientes = JsonSerializer.Deserialize<List<Cliente>>(json) ?? new List<Cliente>();

                if (clientes.Any(c => c.Usuario == request.Usuario))
                {
                    throw new Exception("Ya existe un usuario con ese nombre de usuario");
                }

                if (clientes.Any(c => c.Cedula == request.Cedula))
                {
                    throw new Exception("Ya existe un usuario con esa cédula");
                }

                var nuevoCliente = new Cliente
                {
                    Id = clientes.Count > 0 ? clientes.Max(c => c.Id) + 1 : 1,
                    Cedula = request.Cedula,
                    Nombre = request.Nombre,
                    Apellido1 = request.Apellido1,
                    Apellido2 = request.Apellido2,
                    Direccion = request.Direccion,
                    Telefono = request.Telefono,
                    Usuario = request.Usuario,
                    Password = request.Password,
                    Email = request.Email,
                    TipoCliente = request.TipoCliente
                };

                clientes.Add(nuevoCliente);
                File.WriteAllText(_clientesFilePath, JsonSerializer.Serialize(clientes));

                return nuevoCliente;
            }
        }
    }
} 
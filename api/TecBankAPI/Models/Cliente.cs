using System.ComponentModel.DataAnnotations;
using BCrypt.Net;

namespace TecBankAPI.Models
{
    public class Cliente
    {
        public int Id { get; set; }
        public required string Usuario { get; set; }
        
        private string _password;
        public string Password
        {
            get => _password;
            set => _password = HashPassword(value);
        }
        
        public required string Nombre { get; set; }
        public required string Apellido1 { get; set; }
        public required string Apellido2 { get; set; }
        public required string Cedula { get; set; }
        public required string Direccion { get; set; }
        public required string Telefono { get; set; }
        public required string Email { get; set; }
        public required string TipoCliente { get; set; }

        private static string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public bool VerifyPassword(string password)
        {
            return BCrypt.Net.BCrypt.Verify(password, _password);
        }
    }
} 
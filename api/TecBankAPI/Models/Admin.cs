using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;

namespace TecBankAPI.Models
{
    public class Admin
    {
        [Required]
        public string Usuario { get; set; }
        
        [Required]
        private string _password;
        public string Password
        {
            get => _password;
            set => _password = HashPassword(value);
        }

        [Required]
        public string Nombre { get; set; }
        
        [Required]
        public string Rol { get; set; }

        private static string HashPassword(string password)
        {
            using var sha256 = SHA256.Create();
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }

        public bool VerifyPassword(string password)
        {
            return HashPassword(password) == _password;
        }
    }

    public class AdminLoginRequest
    {
        [Required]
        public string Usuario { get; set; }
        
        [Required]
        public string Password { get; set; }
    }

    public class AdminRegisterRequest
    {
        [Required]
        public string Usuario { get; set; }
        
        [Required]
        public string Password { get; set; }
        
        [Required]
        public string Nombre { get; set; }
        
        [Required]
        public string Rol { get; set; }
    }
} 
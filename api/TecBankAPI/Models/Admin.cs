using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models
{
    public class Admin
    {
        [Required]
        public required string Usuario { get; set; }
        
        [Required]
        public required string Password { get; set; }

        [Required]
        public required string Nombre { get; set; }
        
        [Required]
        public required string Rol { get; set; }
    }

    public class AdminLoginRequest
    {
        [Required]
        public required string Usuario { get; set; }
        
        [Required]
        public required string Password { get; set; }
    }

    public class AdminRegisterRequest
    {
        [Required]
        public required string Usuario { get; set; }
        
        [Required]
        public required string Password { get; set; }
        
        [Required]
        public required string Nombre { get; set; }
        
        [Required]
        public required string Rol { get; set; }
    }
} 
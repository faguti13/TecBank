using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;

namespace TecBankAPI.Models;

public class Cliente
{
    [Key]
    public string Cedula { get; set; } = string.Empty;
    
    public string Nombre { get; set; } = string.Empty;
    public string Apellido1 { get; set; } = string.Empty;
    public string Apellido2 { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    [Required]
    public string Usuario { get; set; } = string.Empty;
    [Required]
    private string _password;
    public string Password
    {
        get => _password;
        set => _password = HashPassword(value);
    }
    public decimal IngresoMensual { get; set; }
    public string TipoCliente { get; set; } = string.Empty; // Físico o Jurídico

    // Relaciones
    public virtual ICollection<Cuenta> Cuentas { get; set; } = new List<Cuenta>();
    public virtual ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();

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

public class LoginRequest
{
    [Required]
    public string Usuario { get; set; }
    [Required]
    public string Password { get; set; }
}

public class RegisterRequest
{
    [Required]
    public string Cedula { get; set; }
    [Required]
    public string Nombre { get; set; }
    [Required]
    public string Apellido1 { get; set; }
    public string Apellido2 { get; set; }
    [Required]
    public string Direccion { get; set; }
    [Required]
    public string Telefono { get; set; }
    [Required]
    public string Usuario { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    public decimal IngresoMensual { get; set; }
    [Required]
    public string TipoCliente { get; set; }
} 
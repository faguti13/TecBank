using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Cliente
{
    [Key]
    public string Cedula { get; set; } = string.Empty;
    
    public string Nombre { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Usuario { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool TipoCliente { get; set; } // true para jurídico, false para físico
    public decimal IngresoMensual { get; set; }

    // Relaciones
    public virtual ICollection<Cuenta> Cuentas { get; set; } = new List<Cuenta>();
    public virtual ICollection<Prestamo> Prestamos { get; set; } = new List<Prestamo>();
} 
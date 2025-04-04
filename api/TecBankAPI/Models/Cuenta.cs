using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Cuenta
{
    [Key]
    public string Numero { get; set; } = string.Empty;
    
    public string Descripcion { get; set; } = string.Empty;
    public string Moneda { get; set; } = string.Empty; // "Colones", "Dolares", "Euros"
    public bool TipoCuenta { get; set; } // true para Corriente, false para Ahorros
    public decimal SaldoDisponible { get; set; }

    // Relaciones
    public string CedulaCliente { get; set; } = string.Empty;
    public virtual Cliente? Owner { get; set; }
    public virtual ICollection<Tarjeta> Tarjetas { get; set; } = new List<Tarjeta>();
    public virtual ICollection<Transaccion> Transacciones { get; set; } = new List<Transaccion>();
} 
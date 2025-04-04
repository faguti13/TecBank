using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Tarjeta
{
    [Key]
    public string Numero { get; set; } = string.Empty;
    
    public bool TipoTarjeta { get; set; } // true para Crédito, false para Débito
    public DateTime FechaExpiracion { get; set; }
    public string CodigoSeguridad { get; set; } = string.Empty;
    public decimal SaldoDisponible { get; set; }
    public decimal SaldoPendiente { get; set; } // Solo para tarjetas de crédito

    // Relaciones
    public string NumeroCuenta { get; set; } = string.Empty;
    public virtual Cuenta? CuentaAsociada { get; set; }
} 
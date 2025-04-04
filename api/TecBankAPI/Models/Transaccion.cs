using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Transaccion
{
    [Key]
    public int ID { get; set; }
    public string NumeroCuenta { get; set; } = string.Empty;
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public string TipoTransaccion { get; set; } = string.Empty; // "Depósito", "Retiro", "Transferencia"

    public virtual Cuenta? Cuenta { get; set; }
} 
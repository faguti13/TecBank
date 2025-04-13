using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Transaccion
{
    [Key]
    public int Id { get; set; }
    public int CuentaOrigenId { get; set; }
    public int? CuentaDestinoId { get; set; }
    public decimal Monto { get; set; }
    public string Tipo { get; set; } = string.Empty;
    public DateTime Fecha { get; set; }
    public string Descripcion { get; set; } = string.Empty;
    public string Estado { get; set; } = "Completada";

    public virtual Cuenta? CuentaOrigen { get; set; }
    public virtual Cuenta? CuentaDestino { get; set; }
} 
using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Prestamo
{
    [Key]
    public string ID { get; set; } = string.Empty;
    
    public decimal MontoOriginal { get; set; }
    public decimal Saldo { get; set; }
    public float TasaInteres { get; set; }
    public decimal Amortizacion { get; set; }

    // Relaciones
    public string CedulaCliente { get; set; } = string.Empty;
    public virtual Cliente? Deudor { get; set; }
    public virtual ICollection<CalendarioPagos> CalendarioPagos { get; set; } = new List<CalendarioPagos>();
} 
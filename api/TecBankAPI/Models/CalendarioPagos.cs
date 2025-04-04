using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class CalendarioPagos
{
    [Key]
    public int ID { get; set; }
    
    public DateTime FechaPago { get; set; }
    public decimal Monto { get; set; }
    public bool Estado { get; set; } // true para pagado, false para pendiente
    public decimal InteresesAcumulados { get; set; }

    // Relaciones
    public string IDPrestamo { get; set; } = string.Empty;
    public virtual Prestamo? Pago { get; set; }
} 
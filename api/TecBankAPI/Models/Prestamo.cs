using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Prestamo
{
    public int Id { get; set; }

    [Required]
    public decimal MontoOriginal { get; set; }

    [Required]
    public decimal Saldo { get; set; }

    [Required]
    public int ClienteId { get; set; }

    [Required]
    public decimal TasaInteres { get; set; }

    [Required]
    public int PlazoMeses { get; set; }

    public DateTime FechaCreacion { get; set; }

    public List<PagoPrestamo> Pagos { get; set; } = new List<PagoPrestamo>();
    
    public List<CalendarioPago> CalendarioPagos { get; set; } = new List<CalendarioPago>();
}

public class PagoPrestamo
{
    public int Id { get; set; }
    
    [Required]
    public int PrestamoId { get; set; }

    [Required]
    public decimal Monto { get; set; }

    [Required]
    public DateTime FechaPago { get; set; }

    public bool EsPagoExtraordinario { get; set; }
}

public class CalendarioPago
{
    public int Id { get; set; }

    [Required]
    public int PrestamoId { get; set; }

    [Required]
    public int NumeroCuota { get; set; }

    [Required]
    public DateTime FechaProgramada { get; set; }

    [Required]
    public decimal MontoAmortizacion { get; set; }

    [Required]
    public decimal MontoInteres { get; set; }

    [Required]
    public decimal MontoCuota { get; set; }

    public decimal? SaldoProyectado { get; set; }

    public bool Pagado { get; set; }
} 
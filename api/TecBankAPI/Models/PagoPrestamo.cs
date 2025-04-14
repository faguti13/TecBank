public class PagoPrestamo
{
    public int Id { get; set; }
    public int PrestamoId { get; set; }
    public int CuentaId { get; set; }
    public decimal Monto { get; set; }
    public DateTime Fecha { get; set; }
    public bool EsPagoExtraordinario { get; set; }
} 
namespace TecBankAPI.Models
{
    public class Cuenta
    {
        public int Id { get; set; }
        public string NumeroCuenta { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public string Moneda { get; set; } = "Colones";
        public string TipoCuenta { get; set; } = "Ahorros";
        public string CedulaCliente { get; set; } = string.Empty;
    }
}
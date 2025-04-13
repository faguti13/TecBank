using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models
{
    public class Cuenta
    {
        public int Id { get; set; }
        public required string NumeroCuenta { get; set; }
        public required string Descripcion { get; set; }
        public required string Moneda { get; set; }
        public required string TipoCuenta { get; set; }
        public required string CedulaCliente { get; set; }
        public decimal Saldo { get; set; }
    }
}
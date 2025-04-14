using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace TecBankAPI.Models
{
    public class Cuenta
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "El número de cuenta es requerido")]
        [RegularExpression(@"^CR\d{20}$", ErrorMessage = "El número de cuenta debe tener el formato IBAN de Costa Rica (CR + 20 dígitos)")]
        [StringLength(22, MinimumLength = 22, ErrorMessage = "El número de cuenta debe tener exactamente 22 caracteres")]
        public string NumeroCuenta { get; set; }

        [Required(ErrorMessage = "La descripción es requerida")]
        public string Descripcion { get; set; }

        [Required(ErrorMessage = "La moneda es requerida")]
        [RegularExpression(@"^(CRC|USD|EUR)$", ErrorMessage = "La moneda debe ser CRC, USD o EUR")]
        public string Moneda { get; set; }

        [Required(ErrorMessage = "El tipo de cuenta es requerido")]
        [RegularExpression(@"^(Ahorros|Corriente)$", ErrorMessage = "El tipo de cuenta debe ser Ahorros o Corriente")]
        public string TipoCuenta { get; set; }

        [Required(ErrorMessage = "La cédula del cliente es requerida")]
        public string CedulaCliente { get; set; }

        public decimal Saldo { get; set; }
    }
}
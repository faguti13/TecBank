using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models;

public class Tarjeta
    {
        [Required] 
        public int Id { get; set; }  

        [Required]  
        public string NumeroCuenta { get; set; }

        [Required]
        public string NumeroTarjeta { get; set; }

        [Required]
        public string TipoTarjeta { get; set; }  // 'debito' | 'credito'

        public decimal? SaldoDisponible { get; set; }  // Este es opcional si es débito
        public decimal? MontoCredito { get; set; }    // Este es opcional si es crédito

        [Required]
        public string fechaExpiracion { get; set; }  // Fecha de expiración

        [Required]
        public string CodigoSeguridad { get; set; }  // Código de seguridad (CVV)

        [Required]
        public decimal MontoSinCancelar { get; set; }
    }

public class Compra
    {
        [Required]
        public int Id { get; set; }  
        
        [Required]
        public string NumeroTarjeta { get; set; } 

        [Required]
        public string Monto { get; set; }  

        [Required]
        public string Fecha { get; set; }  
    }


public class ActualizarMontoRequest
{
    public string NumeroTarjeta { get; set; }
    public decimal NuevoMonto { get; set; }  // El monto a restar
}
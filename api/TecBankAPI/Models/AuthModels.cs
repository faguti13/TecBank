namespace TecBankAPI.Models
{
    public class LoginRequest
    {
        public required string Usuario { get; set; }
        public required string Password { get; set; }
    }

    public class RegisterRequest
    {
        public required string Usuario { get; set; }
        public required string Password { get; set; }
        public required string Email { get; set; }
        public required string Cedula { get; set; }
        public required string Nombre { get; set; }
        public required string Apellido1 { get; set; }
        public required string Apellido2 { get; set; }
        public required string Direccion { get; set; }
        public required string Telefono { get; set; }
        public required string TipoCliente { get; set; }
    }
} 
using System.ComponentModel.DataAnnotations;

namespace TecBankAPI.Models
{
    public class Rol
    {
        public int Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Nombre { get; set; } = string.Empty;

        [StringLength(200)]
        public string Descripcion { get; set; } = string.Empty;
    }
} 
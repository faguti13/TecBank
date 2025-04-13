//Define que compone a un asesor, es decir sus atributos
using System.Text.Json.Serialization;

namespace TecBankAPI.Models{
 public class Asesor{
    public int Id{get; set;}

        [JsonPropertyName("cedula")]
        public string Cedula { get; set; } = string.Empty;

        [JsonPropertyName("nombre_1")]
        public string Nombre1 { get; set; } = string.Empty;

        [JsonPropertyName("nombre_2")]
        public string Nombre2 { get; set; } = string.Empty;

        [JsonPropertyName("apellido_1")]
        public string Apellido1 { get; set; } = string.Empty;

        [JsonPropertyName("apellido_2")]
        public string Apellido2 { get; set; } = string.Empty;

        [JsonPropertyName("fecha_nacimiento")]
        public string FechaNacimiento { get; set; } = string.Empty;

        [JsonPropertyName("meta_colones")]
        public decimal MetaColones { get; set; }

        [JsonPropertyName("meta_dolares")]
        public decimal MetaDolares { get; set; }

        public string NombreCompleto => $"{Nombre1} {Nombre2} {Apellido1} {Apellido2}";

        public decimal ComisionesColones { get; set; }
        public decimal ComisionesDolares { get;  set; }
        public decimal VentasColones { get;  set; }
        public decimal VentasDolares { get; set; }
        public decimal ComisionTotal { get; set; }
    }

}
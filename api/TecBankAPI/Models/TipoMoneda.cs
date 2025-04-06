using System.Text.Json.Serialization;

namespace TecBankAPI.Models
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum TipoMoneda
    {
        Colones,
        Dolares,
        Euros
    }
} 
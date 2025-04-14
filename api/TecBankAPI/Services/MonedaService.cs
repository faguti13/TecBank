using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class MonedaService
    {
        private static readonly Dictionary<(string, string), decimal> TasasCambio = new()
        {
            { ("USD", "CRC"), 500m },
            { ("EUR", "CRC"), 500m },
            { ("USD", "EUR"), 1m },
            { ("EUR", "USD"), 1m },
            { ("CRC", "USD"), 1m/500m },
            { ("CRC", "EUR"), 1m/500m }
        };

        public decimal ConvertirMonto(decimal monto, string monedaOrigen, string monedaDestino)
        {
            if (monedaOrigen == monedaDestino)
                return monto;

            if (TasasCambio.TryGetValue((monedaOrigen, monedaDestino), out decimal tasa))
                return monto * tasa;

            throw new Exception($"No se encontró tasa de cambio para {monedaOrigen} a {monedaDestino}");
        }
    }
} 
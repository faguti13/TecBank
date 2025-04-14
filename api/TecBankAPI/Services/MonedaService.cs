using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class MonedaService
    {
        private static readonly Dictionary<(string, string), decimal> TasasCambio = new()
        {
            // Tasas directas
            { ("Dolares", "Colones"), 500m },
            { ("Euros", "Colones"), 600m },
            { ("Dolares", "Euros"), 0.85m },
            { ("Euros", "Dolares"), 1.18m },
            { ("Colones", "Dolares"), 1m/500m },
            { ("Colones", "Euros"), 1m/600m },
            // Códigos de moneda
            { ("USD", "CRC"), 500m },
            { ("EUR", "CRC"), 600m },
            { ("USD", "EUR"), 0.85m },
            { ("EUR", "USD"), 1.18m },
            { ("CRC", "USD"), 1m/500m },
            { ("CRC", "EUR"), 1m/600m }
        };

        private string NormalizarMoneda(string moneda)
        {
            return moneda.ToUpper() switch
            {
                "CRC" => "Colones",
                "USD" => "Dolares",
                "EUR" => "Euros",
                _ => moneda
            };
        }

        public decimal ConvertirMonto(decimal monto, string monedaOrigen, string monedaDestino)
        {
            if (monedaOrigen == monedaDestino)
                return monto;

            // Intentar primero con los códigos originales
            if (TasasCambio.TryGetValue((monedaOrigen, monedaDestino), out decimal tasa))
                return monto * tasa;

            // Si no funciona, intentar con las monedas normalizadas
            var origenNormalizado = NormalizarMoneda(monedaOrigen);
            var destinoNormalizado = NormalizarMoneda(monedaDestino);

            if (TasasCambio.TryGetValue((origenNormalizado, destinoNormalizado), out tasa))
                return monto * tasa;

            throw new Exception($"No se encontró tasa de cambio para {monedaOrigen} a {monedaDestino}");
        }
    }
} 
using TecBankAPI.Models;
using System.Collections.Generic;

namespace TecBankAPI.Services
{
    public class MonedaService
    {
        private static readonly Dictionary<string, HashSet<string>> MonedasEquivalentes = new()
        {
            { "Colones", new HashSet<string> { "CRC", "COLONES", "Colones" } },
            { "Dolares", new HashSet<string> { "USD", "DOLARES", "Dolares" } },
            { "Euros", new HashSet<string> { "EUR", "EUROS", "Euros" } }
        };

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
            if (string.IsNullOrEmpty(moneda))
                throw new ArgumentException("La moneda no puede ser nula o vacía");

            moneda = moneda.Trim().ToUpper();
            
            foreach (var grupo in MonedasEquivalentes)
            {
                if (grupo.Value.Contains(moneda))
                    return grupo.Key;
            }

            return moneda;
        }

        private bool SonMismaMoneda(string moneda1, string moneda2)
        {
            if (string.IsNullOrEmpty(moneda1) || string.IsNullOrEmpty(moneda2))
                return false;

            var m1 = NormalizarMoneda(moneda1);
            var m2 = NormalizarMoneda(moneda2);
            return m1 == m2;
        }

        public decimal ConvertirMonto(decimal monto, string monedaOrigen, string monedaDestino)
        {
            // Validaciones básicas
            if (monto < 0)
                throw new ArgumentException("El monto no puede ser negativo");

            if (string.IsNullOrEmpty(monedaOrigen) || string.IsNullOrEmpty(monedaDestino))
                throw new ArgumentException("Las monedas no pueden ser nulas o vacías");

            // Si son la misma moneda (incluyendo códigos equivalentes)
            if (SonMismaMoneda(monedaOrigen, monedaDestino))
                return monto;

            // Intentar con los valores originales
            if (TasasCambio.TryGetValue((monedaOrigen, monedaDestino), out decimal tasa))
                return monto * tasa;

            // Intentar con valores normalizados
            var origenNorm = NormalizarMoneda(monedaOrigen);
            var destinoNorm = NormalizarMoneda(monedaDestino);

            if (TasasCambio.TryGetValue((origenNorm, destinoNorm), out tasa))
                return monto * tasa;

            throw new Exception($"No se encontró tasa de cambio para {monedaOrigen} a {monedaDestino}");
        }
    }
} 
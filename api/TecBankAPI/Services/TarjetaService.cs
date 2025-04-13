using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class TarjetaService
    {
        private readonly string _tarjetasPath;
        private readonly string _comprasPath;
        private static readonly object _lock = new object();

        public TarjetaService(IWebHostEnvironment webHostEnvironment)
        {
            var dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data");
            _tarjetasPath = Path.Combine(dataPath, "tarjetas.json");
            _comprasPath = Path.Combine(dataPath, "compras_tarjetas.json");

            // Crear archivo si no existe
            if (!Directory.Exists(dataPath))
                Directory.CreateDirectory(dataPath);

            if (!File.Exists(_tarjetasPath))
                File.WriteAllText(_tarjetasPath, "[]");

            if (!File.Exists(_comprasPath))
                File.WriteAllText(_comprasPath, "[]");
        }

        private List<T> ReadData<T>(string path)
        {
            lock (_lock)
            {
                var jsonString = File.ReadAllText(path);
                return JsonSerializer.Deserialize<List<T>>(jsonString) ?? new List<T>();
            }
        }

        public void SaveData<T>(List<T> data, string path)
        {
            lock (_lock)
            {
                var jsonString = JsonSerializer.Serialize(data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(path, jsonString);
            }
        }

        public List<Tarjeta> GetAll()
        {
            return ReadData<Tarjeta>(_tarjetasPath);
        }

        public Tarjeta? GetById(int id)
        {
            return ReadData<Tarjeta>(_tarjetasPath).FirstOrDefault(t => t.Id == id);
        }

        // Método para buscar tarjeta por número de cuenta
        public Tarjeta? GetByNumeroCuenta(string numeroCuenta)
        {
            return ReadData<Tarjeta>(_tarjetasPath).FirstOrDefault(t => t.NumeroCuenta == numeroCuenta);
        }

        // Método para buscar tarjeta por número de ctarjeta
        public Tarjeta? GetByNumeroTarjeta(string numeroTarjeta)
        {
            return ReadData<Tarjeta>(_tarjetasPath).FirstOrDefault(t => t.NumeroTarjeta == numeroTarjeta);
        }

        public bool DeleteTarjeta(string numeroTarjeta)
        {
            var tarjetas = ReadData<Tarjeta>(_tarjetasPath);
            var tarjeta = tarjetas.FirstOrDefault(t => t.NumeroTarjeta == numeroTarjeta);
            if (tarjeta == null) return false;

            tarjetas.Remove(tarjeta);
            SaveData(tarjetas, _tarjetasPath);
            return true;
        }

        public Tarjeta Create(Tarjeta tarjeta)
        {
            try
            {
                var tarjetas = ReadData<Tarjeta>(_tarjetasPath);
                tarjeta.Id = tarjetas.Count > 0 ? tarjetas.Max(t => t.Id) + 1 : 1;

                tarjetas.Add(tarjeta);
                SaveData(tarjetas, _tarjetasPath);

                return tarjeta;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear la tarjeta: {ex.Message}", ex);
            }
        }

        public Compra CreateCompra(Compra compra)
        {
            try
            {
                var compras = ReadData<Compra>(_comprasPath);
                compra.Id = compras.Count > 0 ? compras.Max(t => t.Id) + 1 : 1;

                compras.Add(compra);
                SaveData(compras, _comprasPath);

                return compra;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear la compra: {ex.Message}", ex);
            }
        }

        public List<Compra> GetAllCompras()
        {
            return ReadData<Compra>(_comprasPath);
        }

        public IEnumerable<Compra> CompraGetByNumTarjeta(string numeroTarjeta)
        {
            // Asegúrate de que este método esté devolviendo una lista o colección
            return ReadData<Compra>(_comprasPath).Where(compra => compra.NumeroTarjeta == numeroTarjeta).ToList();
        }

    }
}

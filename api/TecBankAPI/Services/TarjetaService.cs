using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class TarjetaService
    {
        private readonly string _tarjetasPath;
        private static readonly object _lock = new object();

        public TarjetaService(IWebHostEnvironment webHostEnvironment)
        {
            var dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data");
            _tarjetasPath = Path.Combine(dataPath, "tarjetas.json");

            // Crear archivo si no existe
            if (!Directory.Exists(dataPath))
                Directory.CreateDirectory(dataPath);

            if (!File.Exists(_tarjetasPath))
                File.WriteAllText(_tarjetasPath, "[]");
        }

        private List<T> ReadData<T>(string path)
        {
            lock (_lock)
            {
                var jsonString = File.ReadAllText(path);
                return JsonSerializer.Deserialize<List<T>>(jsonString) ?? new List<T>();
            }
        }

        private void SaveData<T>(List<T> data, string path)
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
    }
}

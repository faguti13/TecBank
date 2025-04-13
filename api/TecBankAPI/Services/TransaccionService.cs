using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class TransaccionService
    {
        private readonly string _transaccionPath;
        private readonly CuentaService _cuentaService;
        private static readonly object _lock = new object();

        public TransaccionService(IWebHostEnvironment webHostEnvironment, CuentaService cuentaService)
        {
            _cuentaService = cuentaService;
            var dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data");
            _transaccionPath = Path.Combine(dataPath, "transacciones.json");

            if (!Directory.Exists(dataPath))
                Directory.CreateDirectory(dataPath);

            if (!File.Exists(_transaccionPath))
                File.WriteAllText(_transaccionPath, "[]");
        }

        private List<Transaccion> ReadData()
        {
            lock (_lock)
            {
                var jsonString = File.ReadAllText(_transaccionPath);
                return JsonSerializer.Deserialize<List<Transaccion>>(jsonString) ?? new List<Transaccion>();
            }
        }

        private void SaveData(List<Transaccion> transacciones)
        {
            lock (_lock)
            {
                var jsonString = JsonSerializer.Serialize(transacciones, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_transaccionPath, jsonString);
            }
        }

        public List<Transaccion> GetTransaccionesByCuenta(int cuentaId)
        {
            var transacciones = ReadData();
            return transacciones.Where(t => t.CuentaOrigenId == cuentaId || t.CuentaDestinoId == cuentaId).ToList();
        }

        public async Task<Transaccion> RealizarTransferencia(int cuentaOrigenId, int cuentaDestinoId, decimal monto, string descripcion)
        {
            var cuentaOrigen = _cuentaService.GetById(cuentaOrigenId);
            var cuentaDestino = _cuentaService.GetById(cuentaDestinoId);

            if (cuentaOrigen == null || cuentaDestino == null)
                throw new Exception("Una o ambas cuentas no existen");

            if (cuentaOrigen.Saldo < monto)
                throw new Exception("Saldo insuficiente");

            // Crear la transacción
            var transacciones = ReadData();
            var nuevaTransaccion = new Transaccion
            {
                Id = transacciones.Count > 0 ? transacciones.Max(t => t.Id) + 1 : 1,
                CuentaOrigenId = cuentaOrigenId,
                CuentaDestinoId = cuentaDestinoId,
                Monto = monto,
                Tipo = "Transferencia",
                Fecha = DateTime.Now,
                Descripcion = descripcion,
                Estado = "Completada"
            };

            // Actualizar saldos
            cuentaOrigen.Saldo -= monto;
            cuentaDestino.Saldo += monto;

            // Guardar cambios
            _cuentaService.Update(cuentaOrigenId, cuentaOrigen);
            _cuentaService.Update(cuentaDestinoId, cuentaDestino);

            transacciones.Add(nuevaTransaccion);
            SaveData(transacciones);

            return nuevaTransaccion;
        }

        public Transaccion RegistrarDeposito(int cuentaId, decimal monto, string descripcion)
        {
            var cuenta = _cuentaService.GetById(cuentaId);
            if (cuenta == null)
                throw new Exception("La cuenta no existe");

            var transacciones = ReadData();
            var nuevaTransaccion = new Transaccion
            {
                Id = transacciones.Count > 0 ? transacciones.Max(t => t.Id) + 1 : 1,
                CuentaOrigenId = cuentaId,
                Monto = monto,
                Tipo = "Depósito",
                Fecha = DateTime.Now,
                Descripcion = descripcion,
                Estado = "Completada"
            };

            cuenta.Saldo += monto;
            _cuentaService.Update(cuentaId, cuenta);

            transacciones.Add(nuevaTransaccion);
            SaveData(transacciones);

            return nuevaTransaccion;
        }

        public Transaccion RegistrarRetiro(int cuentaId, decimal monto, string descripcion)
        {
            var cuenta = _cuentaService.GetById(cuentaId);
            if (cuenta == null)
                throw new Exception("La cuenta no existe");

            if (cuenta.Saldo < monto)
                throw new Exception("Saldo insuficiente");

            var transacciones = ReadData();
            var nuevaTransaccion = new Transaccion
            {
                Id = transacciones.Count > 0 ? transacciones.Max(t => t.Id) + 1 : 1,
                CuentaOrigenId = cuentaId,
                Monto = monto,
                Tipo = "Retiro",
                Fecha = DateTime.Now,
                Descripcion = descripcion,
                Estado = "Completada"
            };

            cuenta.Saldo -= monto;
            _cuentaService.Update(cuentaId, cuenta);

            transacciones.Add(nuevaTransaccion);
            SaveData(transacciones);

            return nuevaTransaccion;
        }
    }
} 
using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services
{
    public class PrestamoService
    {
        private readonly string _prestamosPath;
        private readonly string _pagosPath;
        private readonly string _calendarioPath;
        private readonly ClienteService _clienteService;
        private readonly AsesorService _asesorService;
        private readonly CuentaService _cuentaService;
        private readonly TransaccionService _transaccionService;
        private readonly MonedaService _monedaService;
        private static readonly object _lock = new object();

        public PrestamoService(
            IWebHostEnvironment webHostEnvironment,
            ClienteService clienteService,
            AsesorService asesorService,
            CuentaService cuentaService,
            TransaccionService transaccionService,
            MonedaService monedaService)
        {
            _clienteService = clienteService;
            _asesorService = asesorService;
            _cuentaService = cuentaService;
            _transaccionService = transaccionService;
            _monedaService = monedaService;
            var dataPath = Path.Combine(webHostEnvironment.ContentRootPath, "Data");
            _prestamosPath = Path.Combine(dataPath, "prestamos.json");
            _pagosPath = Path.Combine(dataPath, "pagos_prestamos.json");
            _calendarioPath = Path.Combine(dataPath, "calendario_pagos.json");

            if (!Directory.Exists(dataPath))
                Directory.CreateDirectory(dataPath);

            if (!File.Exists(_prestamosPath))
                File.WriteAllText(_prestamosPath, "[]");
            if (!File.Exists(_pagosPath))
                File.WriteAllText(_pagosPath, "[]");
            if (!File.Exists(_calendarioPath))
                File.WriteAllText(_calendarioPath, "[]");
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

        public List<Prestamo> GetAll()
        {
            var prestamos = ReadData<Prestamo>(_prestamosPath);
            var pagos = ReadData<TecBankAPI.Models.PagoPrestamo>(_pagosPath);
            var calendarios = ReadData<TecBankAPI.Models.CalendarioPago>(_calendarioPath);
            var clientes = _clienteService.GetAllClientes().Result;

            foreach (var prestamo in prestamos)
            {
                prestamo.Pagos = pagos.Where(p => p.PrestamoId == prestamo.Id).ToList();
                prestamo.CalendarioPagos = calendarios.Where(c => c.PrestamoId == prestamo.Id).ToList();
                var cliente = clientes.FirstOrDefault(c => c.Id == prestamo.ClienteId);
                if (cliente != null)
                {
                    prestamo.CedulaCliente = cliente.Cedula;
                }
            }

            return prestamos;
        }

        public Prestamo? GetById(int id)
        {
            var prestamo = ReadData<Prestamo>(_prestamosPath).FirstOrDefault(p => p.Id == id);
            if (prestamo == null) return null;

            prestamo.Pagos = ReadData<TecBankAPI.Models.PagoPrestamo>(_pagosPath)
                .Where(p => p.PrestamoId == id)
                .ToList();
            prestamo.CalendarioPagos = ReadData<TecBankAPI.Models.CalendarioPago>(_calendarioPath)
                .Where(c => c.PrestamoId == id)
                .ToList();

            return prestamo;
        }

        public Prestamo Create(Prestamo prestamo)
        {
            try
            {
                // Validar que el cliente existe
                var clientes = _clienteService.GetAllClientes().Result;
                var cliente = clientes.FirstOrDefault(c => c.Cedula == prestamo.CedulaCliente);
                if (cliente == null)
                {
                    throw new Exception($"No se encontró el cliente con cédula {prestamo.CedulaCliente}");
                }

                prestamo.ClienteId = cliente.Id;

                // Validar que el asesor existe
                var asesores = _asesorService.GetAsesores();
                var asesor = asesores.FirstOrDefault(a => a.Id == prestamo.AsesorId);
                if (asesor == null)
                {
                    throw new Exception($"El asesor con ID {prestamo.AsesorId} no existe");
                }

                var prestamos = ReadData<Prestamo>(_prestamosPath);
                prestamo.Id = prestamos.Count > 0 ? prestamos.Max(p => p.Id) + 1 : 1;
                prestamo.FechaCreacion = DateTime.Now;
                prestamo.Saldo = prestamo.MontoOriginal;

                // Generar calendario de pagos
                var calendarioPagos = GenerarCalendarioPagos(prestamo);
                prestamo.CalendarioPagos = calendarioPagos;

                // Obtener calendarios existentes y agregar el nuevo
                var calendarioExistente = ReadData<CalendarioPago>(_calendarioPath);
                calendarioExistente.AddRange(calendarioPagos);

                prestamos.Add(prestamo);
                SaveData(prestamos, _prestamosPath);
                SaveData(calendarioExistente, _calendarioPath);

                return prestamo;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear el préstamo: {ex.Message}", ex);
            }
        }

        public bool RegistrarPago(int prestamoId, PagoPrestamo pago)
        {
            var prestamo = GetById(prestamoId);
            if (prestamo == null) return false;

            var pagos = ReadData<PagoPrestamo>(_pagosPath);
            pago.Id = pagos.Count > 0 ? pagos.Max(p => p.Id) + 1 : 1;
            pago.PrestamoId = prestamoId;

            // Actualizar saldo del préstamo
            var prestamos = ReadData<Prestamo>(_prestamosPath);
            var prestamoToUpdate = prestamos.First(p => p.Id == prestamoId);
            prestamoToUpdate.Saldo -= pago.Monto;

            // Actualizar saldo de la cuenta y registrar transacción
            if (pago.CuentaId > 0)
            {
                var cuenta = _cuentaService.GetById(pago.CuentaId);
                if (cuenta != null)
                {
                    // Convertir el monto del pago a la moneda de la cuenta
                    decimal montoEnMonedaCuenta = _monedaService.ConvertirMonto(
                        pago.Monto,
                        prestamo.Moneda.ToString(), // Convertir TipoMoneda a string
                        cuenta.Moneda.ToString()    // Convertir TipoMoneda a string
                    );

                    cuenta.Saldo -= montoEnMonedaCuenta;
                    _cuentaService.Update(pago.CuentaId, cuenta);

                    // Registrar la transacción en la moneda de la cuenta
                    _transaccionService.RegistrarRetiro(
                        pago.CuentaId,
                        montoEnMonedaCuenta,
                        $"Pago de préstamo #{prestamoId} {(pago.EsPagoExtraordinario ? "- Pago extraordinario" : "")}",
                        cuenta.Moneda.ToString() // Convertir TipoMoneda a string
                    );
                }
            }

            // Si es pago extraordinario, recalcular calendario
            if (pago.EsPagoExtraordinario)
            {
                RecalcularCalendarioPagos(prestamoToUpdate);
            }

            pagos.Add(pago);
            SaveData(pagos, _pagosPath);
            SaveData(prestamos, _prestamosPath);

            return true;
        }

        private List<CalendarioPago> GenerarCalendarioPagos(Prestamo prestamo)
        {
            var calendarioPagos = new List<CalendarioPago>();
            var saldoRestante = prestamo.MontoOriginal;
            var tasaMensual = prestamo.TasaInteres / 12 / 100; // Convertir tasa anual a mensual
            
            var tasaMensualDouble = (double)tasaMensual;
            var montoOriginalDouble = (double)prestamo.MontoOriginal;
            
            var cuotaFija = (decimal)(montoOriginalDouble * (tasaMensualDouble * Math.Pow(1 + tasaMensualDouble, prestamo.PlazoMeses)) 
                           / (Math.Pow(1 + tasaMensualDouble, prestamo.PlazoMeses) - 1));

            for (int i = 1; i <= prestamo.PlazoMeses; i++)
            {
                var interes = saldoRestante * tasaMensual;
                var amortizacion = cuotaFija - interes;
                saldoRestante -= amortizacion;

                calendarioPagos.Add(new CalendarioPago
                {
                    PrestamoId = prestamo.Id,
                    NumeroCuota = i,
                    FechaProgramada = prestamo.FechaCreacion.AddMonths(i),
                    MontoAmortizacion = Math.Round(amortizacion, 2),
                    MontoInteres = Math.Round(interes, 2),
                    MontoCuota = Math.Round(cuotaFija, 2),
                    SaldoProyectado = Math.Round(saldoRestante, 2),
                    Pagado = false
                });
            }

            return calendarioPagos;
        }

        private List<CalendarioPago> RecalcularCalendarioPagos(Prestamo prestamo)
        {
            // Obtener todos los calendarios
            var todosLosCalendarios = ReadData<CalendarioPago>(_calendarioPath);
            
            // Eliminar solo el calendario del préstamo actual
            var calendariosFiltrados = todosLosCalendarios
                .Where(c => c.PrestamoId != prestamo.Id)
                .ToList();

            // Generar nuevo calendario con el saldo actual
            var nuevoCalendario = GenerarCalendarioPagos(new Prestamo
            {
                Id = prestamo.Id,
                MontoOriginal = prestamo.Saldo, // Usar saldo actual como monto original
                TasaInteres = prestamo.TasaInteres,
                PlazoMeses = prestamo.PlazoMeses,
                FechaCreacion = DateTime.Now
            });

            // Agregar el nuevo calendario a los existentes
            calendariosFiltrados.AddRange(nuevoCalendario);
            
            // Guardar todos los calendarios
            SaveData(calendariosFiltrados, _calendarioPath);
            
            return nuevoCalendario;
        }

        //Obtiene los prestamos por asesor basados en su cédula
        internal IEnumerable<object> GetPrestamosPorAsesor(string cedula)
        {
            throw new NotImplementedException();
        }
    }
} 
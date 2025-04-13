using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;
using System.Text.Json;

namespace TecBankAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportesController : ControllerBase
    {
        private readonly AsesorService _asesorService;
        private readonly PrestamoService _prestamoService;
        private readonly ClienteService _clienteService;
        private readonly ILogger<ReportesController> _logger;
        

        public ReportesController(
            AsesorService asesorService,
            PrestamoService prestamoService, 
            ClienteService clienteService,
            ILogger<ReportesController> logger)
        {
            _asesorService = asesorService;
            _prestamoService = prestamoService;
            _clienteService = clienteService;
            _logger = logger;
        }

        [HttpGet("morosidad")]
        public ActionResult<IEnumerable<ReporteMora>> GetReporteMorosidad()
        {
            try
            {
                _logger.LogInformation("Iniciando generación de reporte de morosidad");
                var prestamos = _prestamoService.GetAll();
                var reporteMora = new List<ReporteMora>();

                foreach (var prestamo in prestamos)
                {
                    try
                    {
                        var cuotasVencidas = prestamo.CalendarioPagos
                            .Count(c => !c.Pagado && c.FechaProgramada < DateTime.Now);

                        if (cuotasVencidas > 0)
                        {
                            var cliente = _clienteService.GetById(prestamo.ClienteId);
                            var montoAdeudado = prestamo.CalendarioPagos
                                .Where(c => !c.Pagado && c.FechaProgramada < DateTime.Now)
                                .Sum(c => c.MontoCuota);

                            _logger.LogInformation($"Préstamo {prestamo.Id} del cliente {cliente.Nombre} {cliente.Apellido1} tiene {cuotasVencidas} cuotas vencidas");

                            reporteMora.Add(new ReporteMora
                            {
                                NombreCliente = $"{cliente.Nombre} {cliente.Apellido1} {cliente.Apellido2}",
                                Cedula = cliente.Cedula,
                                NumeroPrestamo = prestamo.Id,
                                CuotasVencidas = cuotasVencidas,
                                MontoAdeudado = montoAdeudado,
                                Moneda = prestamo.Moneda.ToString()
                            });
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error al procesar préstamo {prestamo.Id}: {ex.Message}");
                        continue; // Continuar con el siguiente préstamo si hay error
                    }
                }

                if (!reporteMora.Any())
                {
                    _logger.LogInformation("No se encontraron préstamos en estado de morosidad");
                    return Ok(new List<ReporteMora>()); // Retornar lista vacía
                }

                _logger.LogInformation($"Reporte de morosidad generado exitosamente con {reporteMora.Count} préstamos");
                return Ok(reporteMora);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al generar el reporte de morosidad: {ex.Message}");
                return StatusCode(500, $"Error interno al generar el reporte de morosidad: {ex.Message}");
            }
        }
        [HttpGet("asesores")]
        public ActionResult<IEnumerable<ReporteAsesor>> GetReporteAsesores()
        {
            try
            {
                _logger.LogInformation("Iniciando generación de reporte de asesores");
                //Obtiene la lista de los asesores con sus ventas y comisiones (Está en AsesorService.cs)
                var asesores = _asesorService.GetAsesoresConVentasYComisiones();
                //Datos del reporte final
                var reporteAsesores = new List<ReporteAsesor>();

                //Se itera sobre cada asesor
                foreach (var asesor in asesores)
                {
                    try
                    {
                         // Asignar valores de ventas y comisiones, asegurándose de que no sean null para no tener problemas con 
                         //formatValue
                        decimal ventasColones = asesor.VentasColones;
                        decimal ventasDolares = asesor.VentasDolares;
                        decimal comisionesColones = asesor.ComisionesColones;
                        decimal comisionesDolares = asesor.ComisionesDolares;

                        //Comisión Total
                        decimal comisionTotal = comisionesColones + comisionesDolares;

                        _logger.LogInformation($"Asesor {asesor.NombreCompleto} tiene ventas de {ventasColones} colones y {ventasDolares} dólares.");

                        //Se agrega al reporte solo si hay ventas o comisiones disponibles
                            reporteAsesores.Add(new ReporteAsesor
                            {
                                NombreAsesor = asesor.NombreCompleto,
                                Cedula = asesor.Cedula,
                                VentasColones = ventasColones,
                                VentasDolares = ventasDolares,
                                ComisionesColones = comisionesColones,
                                ComisionesDolares = comisionesDolares,
                                ComisionTotal = comisionTotal
                            });
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Error al procesar asesor {asesor.Cedula}: {ex.Message}");
                        continue;
                    }
                }

                if (!reporteAsesores.Any())
                {
                    _logger.LogInformation("No se encontraron asesores con datos disponibles");
                    return Ok(new List<ReporteAsesor>());
                }

                _logger.LogInformation($"Reporte de asesores generado exitosamente con {reporteAsesores.Count} asesores.");
                return Ok(reporteAsesores);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al generar el reporte de asesores: {ex.Message}");
                return StatusCode(500, $"Error interno al generar el reporte de asesores: {ex.Message}");
            }
        }
}
    public class ReporteMora
    {
        public required string NombreCliente { get; set; }
        public required string Cedula { get; set; }
        public int NumeroPrestamo { get; set; }
        public int CuotasVencidas { get; set; }
        public decimal MontoAdeudado { get; set; }
        public required string Moneda { get; set; }
    }

// Definición del reporte de asesor
    public class ReporteAsesor
    {
        public required string NombreAsesor { get; set; }
        public required string Cedula { get; set; }
        public decimal VentasColones { get; set; }
        public decimal VentasDolares { get; set; }
        public decimal ComisionesColones { get; set; }
        public decimal ComisionesDolares { get; set; }
        public decimal ComisionTotal { get; set; }
    }
}

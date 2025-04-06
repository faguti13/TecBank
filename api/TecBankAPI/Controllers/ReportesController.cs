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
        private readonly PrestamoService _prestamoService;
        private readonly ClienteService _clienteService;
        private readonly ILogger<ReportesController> _logger;

        public ReportesController(
            PrestamoService prestamoService, 
            ClienteService clienteService,
            ILogger<ReportesController> logger)
        {
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
} 
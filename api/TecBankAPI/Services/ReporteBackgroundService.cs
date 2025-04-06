using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using TecBankAPI.Models;
using TecBankAPI.Controllers;

namespace TecBankAPI.Services
{
    public class ReporteBackgroundService : BackgroundService
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ILogger<ReporteBackgroundService> _logger;

        public ReporteBackgroundService(
            IServiceProvider serviceProvider,
            ILogger<ReporteBackgroundService> logger)
        {
            _serviceProvider = serviceProvider;
            _logger = logger;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                var now = DateTime.Now;
                var nextRun = CalculateNextRunTime(now);
                var delay = nextRun - now;

                _logger.LogInformation($"Próxima generación de reporte programada para: {nextRun}");
                await Task.Delay(delay, stoppingToken);

                try
                {
                    using (var scope = _serviceProvider.CreateScope())
                    {
                        var prestamoService = scope.ServiceProvider.GetRequiredService<PrestamoService>();
                        var clienteService = scope.ServiceProvider.GetRequiredService<ClienteService>();

                        var prestamos = prestamoService.GetAll();
                        var reporteMora = new List<ReporteMora>();

                        foreach (var prestamo in prestamos)
                        {
                            var cuotasVencidas = prestamo.CalendarioPagos
                                .Count(c => !c.Pagado && c.FechaProgramada < DateTime.Now);

                            if (cuotasVencidas > 0)
                            {
                                var cliente = clienteService.GetById(prestamo.ClienteId);
                                var montoAdeudado = prestamo.CalendarioPagos
                                    .Where(c => !c.Pagado && c.FechaProgramada < DateTime.Now)
                                    .Sum(c => c.MontoCuota);

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

                        _logger.LogInformation($"Reporte de morosidad generado con {reporteMora.Count} préstamos en mora");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al generar el reporte de morosidad automáticamente");
                }
            }
        }

        private DateTime CalculateNextRunTime(DateTime now)
        {
            var next = new DateTime(now.Year, now.Month, 5, 0, 0, 0);
            
            if (now.Day > 5)
            {
                next = next.AddMonths(1);
            }
            else if (now.Day == 5 && now.Hour >= 0)
            {
                next = next.AddMonths(1);
            }

            return next;
        }
    }
} 
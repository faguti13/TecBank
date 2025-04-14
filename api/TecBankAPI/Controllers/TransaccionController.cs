using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransaccionesController : ControllerBase
    {
        private readonly TransaccionService _transaccionService;

        public TransaccionesController(TransaccionService transaccionService)
        {
            _transaccionService = transaccionService;
        }

        [HttpGet("cuenta/{cuentaId}")]
        public ActionResult<IEnumerable<Transaccion>> GetTransaccionesByCuenta(int cuentaId)
        {
            return _transaccionService.GetTransaccionesByCuenta(cuentaId);
        }

        [HttpPost("transferencia")]
        public async Task<ActionResult<Transaccion>> RealizarTransferencia([FromBody] TransferenciaRequest request)
        {
            try
            {
                var transaccion = await _transaccionService.RealizarTransferencia(
                    request.CuentaOrigenId,
                    request.CuentaDestinoId,
                    request.Monto,
                    request.Descripcion
                );
                return Ok(transaccion);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("deposito")]
        public ActionResult<Transaccion> RegistrarDeposito([FromBody] MovimientoRequest request)
        {
            try
            {
                var transaccion = _transaccionService.RegistrarDeposito(
                    request.CuentaId,
                    request.Monto,
                    request.Descripcion,
                    request.MonedaOrigen
                );
                return Ok(transaccion);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("retiro")]
        public ActionResult<Transaccion> RegistrarRetiro([FromBody] MovimientoRequest request)
        {
            try
            {
                var transaccion = _transaccionService.RegistrarRetiro(
                    request.CuentaId,
                    request.Monto,
                    request.Descripcion,
                    request.MonedaOrigen
                );
                return Ok(transaccion);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }

    public class TransferenciaRequest
    {
        public int CuentaOrigenId { get; set; }
        public int CuentaDestinoId { get; set; }
        public decimal Monto { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string MonedaOrigen { get; set; } = string.Empty;
    }

    public class MovimientoRequest
    {
        public int CuentaId { get; set; }
        public decimal Monto { get; set; }
        public string Descripcion { get; set; } = string.Empty;
        public string MonedaOrigen { get; set; } = string.Empty;
    }
} 
using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;
using System.Text.Json;

namespace TecBankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TarjetaController : ControllerBase
    {
        private readonly TarjetaService _tarjetaService;

        public TarjetaController(TarjetaService tarjetaService)
        {
            _tarjetaService = tarjetaService;
        }

        [HttpGet]
        public ActionResult<List<Tarjeta>> GetAll()
        {
            var tarjetas = _tarjetaService.GetAll();
            return Ok(tarjetas);
        }

        [HttpGet("{id}")]
        public ActionResult<Tarjeta> GetById(int id)
        {
            var tarjeta = _tarjetaService.GetById(id);
            if (tarjeta == null)
            {
                return NotFound($"Tarjeta con ID {id} no encontrada.");
            }

            return Ok(tarjeta);
        }

        [HttpGet("buscarPorCuenta/{numeroCuenta}")]
        public ActionResult<Tarjeta> GetByNumeroCuenta(string numeroCuenta)
        {
            var tarjetas = _tarjetaService.GetAll();
            var tarjeta = tarjetas.FirstOrDefault(t => t.NumeroCuenta == numeroCuenta); //busca una que coincida
            
            if (tarjeta == null)
            {
                return NotFound($"No se encontró una tarjeta asociada al número de cuenta {numeroCuenta}."); // Si no se encuentra la tarjeta
            }
            return Ok(tarjeta);
        }

                // DELETE: api/Roles/5
        [HttpDelete("{numeroTarjeta}")]
        public IActionResult DeleteTarjeta(string numeroTarjeta)
        {
            var success = _tarjetaService.DeleteTarjeta(numeroTarjeta);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        [HttpGet("buscarPorTarjeta/{numeroTarjeta}")]
        public ActionResult<Tarjeta> GetByNumeroTarjeta(string numeroTarjeta)
        {
            var tarjetas = _tarjetaService.GetAll();
            var tarjeta = tarjetas.FirstOrDefault(t => t.NumeroTarjeta == numeroTarjeta); //busca una que coincida
            
            if (tarjeta == null)
            {
                return NotFound($"No se encontró una tarjeta asociada al número de tarjeta {numeroTarjeta}."); // Si no se encuentra la tarjeta
            }
            return Ok(tarjeta);
        }

        [HttpPost]
        public ActionResult<Tarjeta> Create([FromBody] Tarjeta tarjeta)
        {
            if (tarjeta == null)
            {
                return BadRequest("La tarjeta no puede ser nula.");
            }
            
            var nuevaTarjeta = _tarjetaService.Create(tarjeta);
            return CreatedAtAction(nameof(GetById), new { id = nuevaTarjeta.Id }, nuevaTarjeta);
        }

        [HttpPost("compras")]
        public IActionResult CreateCompra([FromBody] Compra compra)
        {
            if (compra == null)
            {
                return BadRequest("La compra no puede ser nula.");
            }
            
            var nuevaCompra = _tarjetaService.CreateCompra(compra);
             return NoContent();
        }

        [HttpGet("compras")]
        public ActionResult<List<Compra>> GetAllCompras()
        {
            var compras = _tarjetaService.GetAllCompras();
            return Ok(compras);
        }

        [HttpGet("compras/{numeroTarjeta}")]
        public ActionResult<IEnumerable<Compra>> CompraGetByNumTarjeta(string numeroTarjeta)
        {
            var compras = _tarjetaService.CompraGetByNumTarjeta(numeroTarjeta);
            if (compras == null || !compras.Any())
            {
                return NotFound($"No se encontraron compras para la tarjeta {numeroTarjeta}.");
            }

            return Ok(compras);  // Asegúrate de que esto devuelve un array o lista de compras
        }



        [HttpPut("actualizarMonto")]
        public IActionResult ActualizarMonto([FromBody] ActualizarMontoRequest request)
        {
            //Console.WriteLine($"Datos recibidos - NumeroTarjeta: {request.NumeroTarjeta}, NuevoMonto: {request.NuevoMonto}");
            if (string.IsNullOrEmpty(request.NumeroTarjeta) || request.NuevoMonto < 0)
            {
                return BadRequest("Datos inválidos.");
            }

            var tarjeta = _tarjetaService.GetByNumeroTarjeta(request.NumeroTarjeta);
            if (tarjeta == null)
            {
                return NotFound("Tarjeta no encontrada.");
            }

            if (tarjeta.TipoTarjeta == "Debito") // Actualizar saldo o crédito dependiendo del tipo de tarjeta
            {
                if ((tarjeta.SaldoDisponible ?? 0) >= request.NuevoMonto)
                {
                    tarjeta.SaldoDisponible = (tarjeta.SaldoDisponible ?? 0) - request.NuevoMonto;
                }
                else
                {
                    return BadRequest("Saldo disponible insuficiente para realizar la compra.");
                }
            }
            else if (tarjeta.TipoTarjeta == "Credito")
            {
                tarjeta.MontoCredito = (tarjeta.MontoCredito ?? 0) - request.NuevoMonto;
                tarjeta.MontoSinCancelar = tarjeta.MontoSinCancelar + request.NuevoMonto;
            }

            // Actualizar la tarjeta en la lista de tarjetas
            var tarjetas = _tarjetaService.GetAll();
            var tarjetaIndex = tarjetas.FindIndex(t => t.NumeroTarjeta == tarjeta.NumeroTarjeta);
            
            if (tarjetaIndex >= 0)
            {
                tarjetas[tarjetaIndex] = tarjeta; 
            }

            _tarjetaService.SaveData(tarjetas, Path.Combine(Directory.GetCurrentDirectory(), "Data", "tarjetas.json"));
            Console.WriteLine("Datos guardados correctamente.");

            return NoContent(); // Indica que todo se ha realizado correctamente
        }

        [HttpPost("pagos")]
        public IActionResult CreatePago([FromBody] Pago pago)
        {
            if (pago == null)
            {
                return BadRequest("El pago no puede ser nula.");
            }
            
            var nuevoPago = _tarjetaService.CreatePago(pago);
             return NoContent();
        }

       [HttpPut("actualizarSaldo")]
        public IActionResult ActualizarSaldo([FromBody] ActualizarSaldoRequest request)
        {
            //Console.WriteLine($"Datos recibidos - NumeroTarjeta: {request.NumeroTarjeta}, NuevoMonto: {request.NuevoMonto}");
            if (string.IsNullOrEmpty(request.NumeroTarjeta) || request.NuevoMonto < 0)
            {
                return BadRequest("Datos inválidos.");
            }

            var tarjeta = _tarjetaService.GetByNumeroTarjeta(request.NumeroTarjeta);
            if (tarjeta == null)
            {
                return NotFound("Tarjeta no encontrada.");
            }

            if (tarjeta.TipoTarjeta == "Debito") // Actualizar saldo o crédito dependiendo del tipo de tarjeta
            {
                    return BadRequest();
                
            }
            else if (tarjeta.TipoTarjeta == "Credito")
            {
                tarjeta.MontoSinCancelar = tarjeta.MontoSinCancelar - request.NuevoMonto;
            }

            // Actualizar la tarjeta en la lista de tarjetas
            var tarjetas = _tarjetaService.GetAll();
            var tarjetaIndex = tarjetas.FindIndex(t => t.NumeroTarjeta == tarjeta.NumeroTarjeta);
            
            if (tarjetaIndex >= 0)
            {
                tarjetas[tarjetaIndex] = tarjeta; 
            }

            _tarjetaService.SaveData(tarjetas, Path.Combine(Directory.GetCurrentDirectory(), "Data", "tarjetas.json"));
            Console.WriteLine("Datos guardados correctamente.");

            return NoContent(); // Indica que todo se ha realizado correctamente
        }
    }
}

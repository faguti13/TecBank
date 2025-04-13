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
                Console.WriteLine($"Saldo disponible antes: {tarjeta.SaldoDisponible}");
                if ((tarjeta.SaldoDisponible ?? 0) >= request.NuevoMonto)
                {
                    tarjeta.SaldoDisponible = (tarjeta.SaldoDisponible ?? 0) - request.NuevoMonto;
                    Console.WriteLine($"Nuevo saldo disponible: {tarjeta.SaldoDisponible}");
                }
                else
                {
                    return BadRequest("Saldo disponible insuficiente para realizar la compra.");
                }
            }
            else if (tarjeta.TipoTarjeta == "Credito")
            {
                tarjeta.MontoCredito = (tarjeta.MontoCredito ?? 0) - request.NuevoMonto;
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

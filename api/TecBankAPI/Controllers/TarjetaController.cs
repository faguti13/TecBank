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
    }
}

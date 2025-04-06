using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PrestamosController : ControllerBase
    {
        private readonly PrestamoService _prestamoService;

        public PrestamosController(PrestamoService prestamoService)
        {
            _prestamoService = prestamoService;
        }

        // GET: api/Prestamos
        [HttpGet]
        public ActionResult<IEnumerable<Prestamo>> GetPrestamos()
        {
            return _prestamoService.GetAll();
        }

        // GET: api/Prestamos/5
        [HttpGet("{id}")]
        public ActionResult<Prestamo> GetPrestamo(int id)
        {
            var prestamo = _prestamoService.GetById(id);

            if (prestamo == null)
            {
                return NotFound();
            }

            return prestamo;
        }

        // POST: api/Prestamos
        [HttpPost]
        public ActionResult<Prestamo> CreatePrestamo(Prestamo prestamo)
        {
            var createdPrestamo = _prestamoService.Create(prestamo);
            return CreatedAtAction(nameof(GetPrestamo), new { id = createdPrestamo.Id }, createdPrestamo);
        }

        // POST: api/Prestamos/5/pagos
        [HttpPost("{id}/pagos")]
        public IActionResult RegistrarPago(int id, PagoPrestamo pago)
        {
            var success = _prestamoService.RegistrarPago(id, pago);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
} 
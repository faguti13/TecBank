//Recibe las peticiones del front end y las dirige
using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AsesorController : ControllerBase
    {
        private readonly AsesorService _asesorService;

        public AsesorController()
        {
            _asesorService = new AsesorService();
        }

        [HttpGet]
        public ActionResult<List<Asesor>> Get()
        {
            return _asesorService.GetAsesores();
        }

        [HttpPost]
        public IActionResult Create([FromBody] Asesor nuevo)
        {
            if (nuevo == null)
            {
                return BadRequest("Asesor no válido.");
            }
            _asesorService.CreateAsesor(nuevo);
            return Ok(nuevo);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] Asesor actualizado)
        {
            _asesorService.UpdateAsesor(id, actualizado);
            return Ok(actualizado);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            _asesorService.DeleteAsesor(id);
            return NoContent();
        }
    }
}


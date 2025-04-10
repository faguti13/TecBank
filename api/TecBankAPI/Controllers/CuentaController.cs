using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuentasController : ControllerBase
    {
        private readonly CuentaService _cuentaService;

        public CuentasController(CuentaService cuentaService)
        {
            _cuentaService = cuentaService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Cuenta>> GetAll()
        {
            return _cuentaService.GetAll();
        }

        [HttpGet("{id}")]
        public ActionResult<Cuenta> GetById(int id)
        {
            var cuenta = _cuentaService.GetById(id);
            if (cuenta == null)
            {
                return NotFound();
            }
            return cuenta;
        }

        [HttpPost]
        public ActionResult<Cuenta> Create(Cuenta cuenta)
        {
            var createdCuenta = _cuentaService.Create(cuenta);
            return CreatedAtAction(nameof(GetById), new { id = createdCuenta.Id }, createdCuenta);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Cuenta cuenta)
        {
            if (_cuentaService.Update(id, cuenta))
            {
                return NoContent();
            }
            return NotFound();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            if (_cuentaService.Delete(id))
            {
                return NoContent();
            }
            return NotFound();
        }
    }
}
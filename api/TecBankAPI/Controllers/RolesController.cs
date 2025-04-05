using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly RolService _rolService;

        public RolesController(RolService rolService)
        {
            _rolService = rolService;
        }

        // GET: api/Roles
        [HttpGet]
        public ActionResult<IEnumerable<Rol>> GetRoles()
        {
            return _rolService.GetAll();
        }

        // GET: api/Roles/5
        [HttpGet("{id}")]
        public ActionResult<Rol> GetRol(int id)
        {
            var rol = _rolService.GetById(id);

            if (rol == null)
            {
                return NotFound();
            }

            return rol;
        }

        // POST: api/Roles
        [HttpPost]
        public ActionResult<Rol> CreateRol(Rol rol)
        {
            var createdRol = _rolService.Create(rol);
            return CreatedAtAction(nameof(GetRol), new { id = createdRol.Id }, createdRol);
        }

        // PUT: api/Roles/5
        [HttpPut("{id}")]
        public IActionResult UpdateRol(int id, Rol rol)
        {
            if (id != rol.Id)
            {
                return BadRequest();
            }

            var success = _rolService.Update(id, rol);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }

        // DELETE: api/Roles/5
        [HttpDelete("{id}")]
        public IActionResult DeleteRol(int id)
        {
            var success = _rolService.Delete(id);
            if (!success)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
} 
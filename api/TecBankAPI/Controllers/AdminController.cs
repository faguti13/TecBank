using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<Admin>> Login([FromBody] AdminLoginRequest request)
        {
            try
            {
                var admin = await _adminService.Login(request.Usuario, request.Password);
                if (admin == null)
                {
                    return Unauthorized("Usuario o contraseña incorrectos");
                }

                return Ok(admin);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<Admin>> Register([FromBody] AdminRegisterRequest request)
        {
            try
            {
                var admin = await _adminService.Register(request);
                return Ok(admin);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<List<Admin>>> GetAllAdmins()
        {
            try
            {
                var admins = await _adminService.GetAllAdmins();
                return Ok(admins);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
} 
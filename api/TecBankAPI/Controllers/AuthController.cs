using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<Cliente>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var cliente = await _authService.Login(request.Usuario, request.Password);
                if (cliente == null)
                {
                    return Unauthorized("Usuario o contraseña incorrectos");
                }

                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("register")]
        public async Task<ActionResult<Cliente>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var cliente = await _authService.Register(request);
                return Ok(cliente);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
} 
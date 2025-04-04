using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CuentaController : ControllerBase
{
    private readonly ICuentaService _cuentaService;

    public CuentaController(ICuentaService cuentaService)
    {
        _cuentaService = cuentaService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cuenta>>> GetCuentas()
    {
        var cuentas = await _cuentaService.GetAllCuentas();
        return Ok(cuentas);
    }

    [HttpGet("{numero}")]
    public async Task<ActionResult<Cuenta>> GetCuenta(string numero)
    {
        var cuenta = await _cuentaService.GetCuentaByNumero(numero);
        if (cuenta == null)
        {
            return NotFound();
        }
        return Ok(cuenta);
    }

    [HttpGet("cliente/{cedula}")]
    public async Task<ActionResult<IEnumerable<Cuenta>>> GetCuentasByCliente(string cedula)
    {
        var cuentas = await _cuentaService.GetCuentasByCliente(cedula);
        return Ok(cuentas);
    }

    [HttpPost]
    public async Task<ActionResult<Cuenta>> CreateCuenta(Cuenta cuenta)
    {
        await _cuentaService.CreateCuenta(cuenta);
        return CreatedAtAction(nameof(GetCuenta), new { numero = cuenta.Numero }, cuenta);
    }

    [HttpPut("{numero}")]
    public async Task<IActionResult> UpdateCuenta(string numero, Cuenta cuenta)
    {
        if (numero != cuenta.Numero)
        {
            return BadRequest();
        }

        await _cuentaService.UpdateCuenta(cuenta);
        return NoContent();
    }

    [HttpDelete("{numero}")]
    public async Task<IActionResult> DeleteCuenta(string numero)
    {
        await _cuentaService.DeleteCuenta(numero);
        return NoContent();
    }

    [HttpPost("{numero}/deposito")]
    public async Task<ActionResult<Cuenta>> RealizarDeposito(string numero, [FromBody] decimal monto)
    {
        var cuenta = await _cuentaService.RealizarDeposito(numero, monto);
        return Ok(cuenta);
    }

    [HttpPost("{numero}/retiro")]
    public async Task<ActionResult<Cuenta>> RealizarRetiro(string numero, [FromBody] decimal monto)
    {
        var cuenta = await _cuentaService.RealizarRetiro(numero, monto);
        return Ok(cuenta);
    }
} 
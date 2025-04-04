using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;

namespace TecBankAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    private readonly IClienteService _clienteService;

    public ClienteController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Cliente>>> GetClientes()
    {
        var clientes = await _clienteService.GetAllClientes();
        return Ok(clientes);
    }

    [HttpGet("{cedula}")]
    public async Task<ActionResult<Cliente>> GetCliente(string cedula)
    {
        var cliente = await _clienteService.GetClienteByCedula(cedula);
        if (cliente == null)
        {
            return NotFound();
        }
        return Ok(cliente);
    }

    [HttpPost]
    public async Task<ActionResult<Cliente>> CreateCliente(Cliente cliente)
    {
        await _clienteService.CreateCliente(cliente);
        return CreatedAtAction(nameof(GetCliente), new { cedula = cliente.Cedula }, cliente);
    }

    [HttpPut("{cedula}")]
    public async Task<IActionResult> UpdateCliente(string cedula, Cliente cliente)
    {
        if (cedula != cliente.Cedula)
        {
            return BadRequest();
        }

        await _clienteService.UpdateCliente(cliente);
        return NoContent();
    }

    [HttpDelete("{cedula}")]
    public async Task<IActionResult> DeleteCliente(string cedula)
    {
        await _clienteService.DeleteCliente(cedula);
        return NoContent();
    }
} 
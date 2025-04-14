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

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateCliente(int id, Cliente cliente)
    {
        if (id != cliente.Id)
        {
            return BadRequest();
        }

        await _clienteService.UpdateCliente(cliente);
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteCliente(int id)
    {
        await _clienteService.DeleteCliente(id);
        return NoContent();
    }
} 
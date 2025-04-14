using Microsoft.AspNetCore.Mvc;
using TecBankAPI.Models;
using TecBankAPI.Services;
using System.Text;
using System.Security.Cryptography;
namespace TecBankAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ClienteController : ControllerBase
{
    private readonly IClienteService _clienteService;

    private static readonly byte[] Key = Encoding.UTF8.GetBytes("1234567890123456"); // 16 bytes = 128 bits
    private static readonly byte[] IV = Encoding.UTF8.GetBytes("6543210987654321");  // Also 16 bytes

    public ClienteController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    public static string Decrypt(string encryptedText)
    {
        using var aes = Aes.Create();
        aes.Key = Key;
        aes.IV = IV;

        var decryptor = aes.CreateDecryptor();
        var encryptedBytes = Convert.FromBase64String(encryptedText);
        var decrypted = decryptor.TransformFinalBlock(encryptedBytes, 0, encryptedBytes.Length);
        return Encoding.UTF8.GetString(decrypted);
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
        cliente.Password = ClienteController.Decrypt(cliente.Password);

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
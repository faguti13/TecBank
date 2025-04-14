using TecBankAPI.Models;

namespace TecBankAPI.Services;

public interface IClienteService
{
    Task<IEnumerable<Cliente>> GetAllClientes();
    Task<Cliente?> GetClienteByCedula(string cedula);
    Task CreateCliente(Cliente cliente);
    Task UpdateCliente(Cliente cliente);
    Task DeleteCliente(int id);
} 
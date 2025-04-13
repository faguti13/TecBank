using TecBankAPI.Models;
namespace TecBankAPI.Services;
public interface ICuentaService
{
    Task<IEnumerable<Cuenta>> GetAllCuentas();
    Task<Cuenta?> GetCuentaByNumero(string numero);
    Task<IEnumerable<Cuenta>> GetCuentasByCliente(string nombre);
    Task CreateCuenta(Cuenta cuenta);
    Task UpdateCuenta(Cuenta cuenta);
    Task DeleteCuenta(string numero);
    Task<Cuenta> RealizarDeposito(string numeroCuenta, decimal monto);
    Task<Cuenta> RealizarRetiro(string numeroCuenta, decimal monto);
    }
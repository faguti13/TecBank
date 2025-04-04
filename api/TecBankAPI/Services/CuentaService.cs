using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services;

public class CuentaService : ICuentaService
{
    private readonly string _dataPath = "Data/cuentas.json";
    private List<Cuenta> _cuentas = new();

    public CuentaService()
    {
        LoadData();
    }

    private void LoadData()
    {
        if (File.Exists(_dataPath))
        {
            var jsonString = File.ReadAllText(_dataPath);
            _cuentas = JsonSerializer.Deserialize<List<Cuenta>>(jsonString) ?? new List<Cuenta>();
        }
    }

    private void SaveData()
    {
        var jsonString = JsonSerializer.Serialize(_cuentas, new JsonSerializerOptions { WriteIndented = true });
        Directory.CreateDirectory(Path.GetDirectoryName(_dataPath) ?? string.Empty);
        File.WriteAllText(_dataPath, jsonString);
    }

    public async Task<IEnumerable<Cuenta>> GetAllCuentas()
    {
        return await Task.FromResult(_cuentas);
    }

    public async Task<Cuenta?> GetCuentaByNumero(string numero)
    {
        return await Task.FromResult(_cuentas.FirstOrDefault(c => c.Numero == numero));
    }

    public async Task<IEnumerable<Cuenta>> GetCuentasByCliente(string cedula)
    {
        return await Task.FromResult(_cuentas.Where(c => c.CedulaCliente == cedula));
    }

    public async Task CreateCuenta(Cuenta cuenta)
    {
        if (_cuentas.Any(c => c.Numero == cuenta.Numero))
        {
            throw new InvalidOperationException("Ya existe una cuenta con ese número");
        }

        _cuentas.Add(cuenta);
        SaveData();
        await Task.CompletedTask;
    }

    public async Task UpdateCuenta(Cuenta cuenta)
    {
        var index = _cuentas.FindIndex(c => c.Numero == cuenta.Numero);
        if (index == -1)
        {
            throw new InvalidOperationException("Cuenta no encontrada");
        }

        _cuentas[index] = cuenta;
        SaveData();
        await Task.CompletedTask;
    }

    public async Task DeleteCuenta(string numero)
    {
        var cuenta = _cuentas.FirstOrDefault(c => c.Numero == numero);
        if (cuenta == null)
        {
            throw new InvalidOperationException("Cuenta no encontrada");
        }

        if (cuenta.SaldoDisponible > 0)
        {
            throw new InvalidOperationException("No se puede eliminar una cuenta con saldo disponible");
        }

        _cuentas.Remove(cuenta);
        SaveData();
        await Task.CompletedTask;
    }

    public async Task<Cuenta> RealizarDeposito(string numeroCuenta, decimal monto)
    {
        if (monto <= 0)
        {
            throw new InvalidOperationException("El monto debe ser mayor a cero");
        }

        var cuenta = await GetCuentaByNumero(numeroCuenta);
        if (cuenta == null)
        {
            throw new InvalidOperationException("Cuenta no encontrada");
        }

        cuenta.SaldoDisponible += monto;
        await UpdateCuenta(cuenta);
        return cuenta;
    }

    public async Task<Cuenta> RealizarRetiro(string numeroCuenta, decimal monto)
    {
        if (monto <= 0)
        {
            throw new InvalidOperationException("El monto debe ser mayor a cero");
        }

        var cuenta = await GetCuentaByNumero(numeroCuenta);
        if (cuenta == null)
        {
            throw new InvalidOperationException("Cuenta no encontrada");
        }

        if (cuenta.SaldoDisponible < monto)
        {
            throw new InvalidOperationException("Saldo insuficiente");
        }

        cuenta.SaldoDisponible -= monto;
        await UpdateCuenta(cuenta);
        return cuenta;
    }
} 
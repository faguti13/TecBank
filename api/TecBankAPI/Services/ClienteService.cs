using System.Text.Json;
using TecBankAPI.Models;

namespace TecBankAPI.Services;

public class ClienteService : IClienteService
{
    private readonly string _dataPath = "Data/clientes.json";
    private List<Cliente> _clientes = new();
    private readonly string _clientesFilePath;
    private static readonly object _lock = new object();

    public ClienteService()
    {
        LoadData();
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Data");
        Directory.CreateDirectory(basePath);
        _clientesFilePath = Path.Combine(basePath, "clientes.json");
    }

    private void LoadData()
    {
        if (File.Exists(_dataPath))
        {
            var jsonString = File.ReadAllText(_dataPath);
            _clientes = JsonSerializer.Deserialize<List<Cliente>>(jsonString) ?? new List<Cliente>();
        }
    }

    private void SaveData()
    {
        var jsonString = JsonSerializer.Serialize(_clientes, new JsonSerializerOptions { WriteIndented = true });
        Directory.CreateDirectory(Path.GetDirectoryName(_dataPath) ?? string.Empty);
        File.WriteAllText(_dataPath, jsonString);
    }

    public async Task<IEnumerable<Cliente>> GetAllClientes()
    {
        return await Task.FromResult(_clientes);
    }

    public async Task<Cliente?> GetClienteByCedula(string cedula)
    {
        return await Task.FromResult(_clientes.FirstOrDefault(c => c.Cedula == cedula));
    }

    public async Task CreateCliente(Cliente cliente)
    {
        if (_clientes.Any(c => c.Cedula == cliente.Cedula))
        {
            throw new InvalidOperationException("Ya existe un cliente con esa cédula");
        }
        
        _clientes.Add(cliente);
        SaveData();
        await Task.CompletedTask;
    }

    public async Task UpdateCliente(Cliente cliente)
    {
        var index = _clientes.FindIndex(c => c.Cedula == cliente.Cedula);
        if (index == -1)
        {
            throw new InvalidOperationException("Cliente no encontrado");
        }

        _clientes[index] = cliente;
        SaveData();
        await Task.CompletedTask;
    }

    public async Task DeleteCliente(string cedula)
    {
        var cliente = _clientes.FirstOrDefault(c => c.Cedula == cedula);
        if (cliente == null)
        {
            throw new InvalidOperationException("Cliente no encontrado");
        }

        _clientes.Remove(cliente);
        SaveData();
        await Task.CompletedTask;
    }

    public Cliente GetById(int id)
    {
        lock (_lock)
        {
            if (!File.Exists(_clientesFilePath))
            {
                throw new Exception("No se encontró el archivo de clientes");
            }

            var json = File.ReadAllText(_clientesFilePath);
            var clientes = JsonSerializer.Deserialize<List<Cliente>>(json) ?? new List<Cliente>();
            var cliente = clientes.FirstOrDefault(c => c.Id == id);

            if (cliente == null)
            {
                throw new Exception($"No se encontró el cliente con ID {id}");
            }

            return cliente;
        }
    }
} 
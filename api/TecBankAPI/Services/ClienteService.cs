using System.Text.Json;
using TecBankAPI.Models;
using System.Security.Cryptography;
namespace TecBankAPI.Services;
using System.Text;

public class ClienteService : IClienteService
{
    private readonly string _dataPath = "Data/clientes.json";
    private List<Cliente> _clientes = new();
    private readonly string _clientesFilePath;
    private static readonly object _lock = new object();

    private static readonly byte[] Key = Encoding.UTF8.GetBytes("1234567890123456"); // 16 bytes = 128 bits
    private static readonly byte[] IV = Encoding.UTF8.GetBytes("6543210987654321");  // Also 16 bytes

    public ClienteService()
    {
        LoadData();
        var basePath = Path.Combine(Directory.GetCurrentDirectory(), "Data");
        Directory.CreateDirectory(basePath);
        _clientesFilePath = Path.Combine(basePath, "clientes.json");
    }

    public static string Encrypt(string text)
    {
        using var aes = Aes.Create();
        aes.Key = Key;
        aes.IV = IV;

        var encryptor = aes.CreateEncryptor();
        var inputBytes = Encoding.UTF8.GetBytes(text);
        var encrypted = encryptor.TransformFinalBlock(inputBytes, 0, inputBytes.Length);
        return Convert.ToBase64String(encrypted);
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
        if(cliente.Id == 0){
            cliente.Id =  _clientes.Count > 0 ? _clientes.Max(c => c.Id) + 1 : 1;
        }
        cliente.Password = ClienteService.Encrypt(cliente.Password);
        _clientes.Add(cliente);
        SaveData();
        await Task.CompletedTask;
    }

    public async Task UpdateCliente(Cliente cliente)
    {
        var index = _clientes.FindIndex(c => c.Id == cliente.Id);
        if (index == -1)
        {
            throw new InvalidOperationException("Cliente no encontrado");
        }
        for(int i = 0; i < _clientes.Count(); i++){
            if((i != index) && (_clientes[i].Cedula == cliente.Cedula)){
                throw new InvalidOperationException("Ya existe un cliente con esa cédula");
            }
        }
        cliente.Password = ClienteService.Encrypt(cliente.Password);
        
        _clientes[index] = cliente;
        SaveData();
        await Task.CompletedTask;
    }

    public async Task DeleteCliente(int id)
    {
        var cliente = _clientes.FirstOrDefault(c => c.Id == id);
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
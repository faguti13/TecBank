using System.Text.Json;
using TecBankAPI.Models;


namespace TecBankAPI.Services
{
    public class AsesorService
    {
        private readonly string rutaArchivo = "Data/asesores.json";

        // Obtener todos los asesores guardados(en JSON)
        public List<Asesor> GetAsesores()
        {   
            if (!File.Exists(rutaArchivo)) return new List<Asesor>();
            var json = File.ReadAllText(rutaArchivo);
            return JsonSerializer.Deserialize<List<Asesor>>(json) ?? new List<Asesor>();
        }

        // Crear un asesor
        public void CreateAsesor(Asesor nuevo)
        {
            Console.WriteLine($"Creando asesor: {nuevo.Nombre1} {nuevo.Apellido1}");
            var asesores = GetAsesores();
            nuevo.Id = asesores.Count > 0 ? asesores.Max(a => a.Id) + 1 : 1;
            
            Console.WriteLine($"Nuevo ID asignado: {nuevo.Id}");

            asesores.Add(nuevo);
            Console.WriteLine("Nuevo asesor añadido. Guardando datos...");
            SaveAsesores(asesores);
        }

        // Actualizar un asesor
        public void UpdateAsesor(int id, Asesor actualizado)
        {
            var asesores = GetAsesores();
            var index = asesores.FindIndex(a => a.Id == id);
            if (index == -1) return;
            actualizado.Id = id;
            asesores[index] = actualizado;
            SaveAsesores(asesores);
        }

        // Eliminar un asesor
        public void DeleteAsesor(int id)
        {
            var asesores = GetAsesores();
            asesores = asesores.Where(a => a.Id != id).ToList();
            SaveAsesores(asesores);
        }
        //Guardar los asesores
        private void SaveAsesores(List<Asesor> asesores)
        {
            Console.WriteLine("Guardando asesores en el archivo...");
            var json = JsonSerializer.Serialize(asesores, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(rutaArchivo, json);
            Console.WriteLine("Asesores guardados correctamente.");
        }
    }
}

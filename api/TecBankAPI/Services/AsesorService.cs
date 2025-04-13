using System.Text.Json;
using TecBankAPI.Models;


namespace TecBankAPI.Services
{
    public class AsesorService
    {
        private readonly string rutaArchivo = "Data/asesores.json";
        private readonly string rutaPrestamos = "Data/prestamos.json";

        // Obtener todos los asesores guardados(en JSON)
        public List<Asesor> GetAsesores()
        {   
            if (!File.Exists(rutaArchivo)) return new List<Asesor>();
            var json = File.ReadAllText(rutaArchivo);
            return JsonSerializer.Deserialize<List<Asesor>>(json) ?? new List<Asesor>();
        }
        public List<Asesor> GetAsesoresConVentasYComisiones()
        {
            if (!File.Exists(rutaArchivo)) return new List<Asesor>();
            var jsonAsesores = File.ReadAllText(rutaArchivo);
            var asesores = JsonSerializer.Deserialize<List<Asesor>>(jsonAsesores) ?? new List<Asesor>();

            if (!File.Exists(rutaPrestamos)) return asesores;
            var jsonPrestamos = File.ReadAllText(rutaPrestamos);
            var prestamos = JsonSerializer.Deserialize<List<Prestamo>>(jsonPrestamos) ?? new List<Prestamo>();

            foreach (var asesor in asesores)
            {
                //Filtra los prestamos del asesor
                var prestamosDelAsesor = prestamos.Where(p => p.AsesorId == asesor.Id).ToList();

                //Cálculo de las ventas en colones
                asesor.VentasColones = prestamosDelAsesor
                    .Where(p => p.Moneda == TipoMoneda.Colones)
                    .Sum(p => p.MontoOriginal);

                //Cálculo de las ventas de doláres
                asesor.VentasDolares = prestamosDelAsesor
                    .Where(p => p.Moneda == TipoMoneda.Dolares)
                    .Sum(p => p.MontoOriginal);

                //Metas que se deben superara para ganara comisiones
                decimal metaVentasColones = asesor.MetaColones;  
                decimal metaVentasDolares = asesor.MetaDolares; 

                // Verificar si las ventas superan la meta
                if (asesor.VentasColones > metaVentasColones)
                {
                    asesor.ComisionesColones = asesor.VentasColones * 0.03m;  // Comisión del 3% si superan la meta
                }
                else
                {
                    asesor.ComisionesColones = 0m;  // No hay comisión si no se supera la meta
                }

                if (asesor.VentasDolares > metaVentasDolares)
                {
                    asesor.ComisionesDolares = asesor.VentasDolares * 0.03m;  // Comisión del 3% si superan la meta
                }
                else
                {
                    asesor.ComisionesDolares = 0m;  // No hay comisión si no se supera la meta
                }

                // Sumar comisiones totales
                asesor.ComisionTotal = asesor.ComisionesColones + asesor.ComisionesDolares;
            }

            return asesores;
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

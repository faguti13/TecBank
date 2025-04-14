import React, { useState, useEffect } from 'react'; 
import {  getAllAsesores, createAsesor,deleteAsesor,updateAsesor  } from '../services/asesoresService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

//Definición de un nuevo asesor 
interface Asesor{
    id?:number;
    cedula:string;
    nombre_1:string;
    nombre_2:string;                                                         
    apellido_1:string;
    apellido_2:string;
    fecha_nacimiento:string;
    meta_colones:number;
    meta_dolares: number;
}

const Asesores: React.FC = () => {
    const [asesores, setAsesores] = useState<Asesor[]>([]);//Almacena los asesores cargados desde el back end
   //Asesor que se está creando o editando
    const [newAsesor, setNewAsesor] = useState<Asesor>({
      cedula:'',
      nombre_1: '',
      nombre_2: '',
      apellido_1: '',
      apellido_2: '',
      fecha_nacimiento:'',
      meta_colones: 0,
      meta_dolares: 0,
    });

    const [currentAsesor, setCurrentAsesor] = useState<Asesor | null>(null); //Guarda al asesor en edición
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);
  
    //Carga los asesores desde le back end
    const loadAsesores = async () => {
          try {
            const data = await getAllAsesores();
            setAsesores(data);  
          } catch (error) {
            console.error('Error al cargar los asesores:', error);
          }
        };
        useEffect(() => {loadAsesores();
      }, []);  
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Datos a enviar:", newAsesor);
        //Formateo de la fecha 
        const formattedDate = new Date(newAsesor.fecha_nacimiento).toISOString().split('T')[0];
        const asesorToSubmit = { ...newAsesor, fecha_nacimiento: formattedDate };

        //Verificar que la cédula sea única para cada asesor
        const cedulaRepetida = asesores.some((a) =>
          a.cedula === newAsesor.cedula &&
          (!isEditing || (isEditing && a.id !== currentAsesor?.id))
        ); 
        //Verifica que el asesor sea al menos mayor de edad
        const esMayorDeEdad = (fechaNacimiento: string): boolean => {
          const hoy = new Date();
          const nacimiento = new Date(fechaNacimiento);
          const edad = hoy.getFullYear() - nacimiento.getFullYear(); //Calcula años
          const mes = hoy.getMonth() - nacimiento.getMonth();//Calcula meses
          return edad > 18 || (edad === 18 && mes >= 0 && hoy.getDate() >= nacimiento.getDate()); //Retorna verdadero si es mayor de edad
        };
        //Validacion de entrys
        const validarDatos = (): boolean => {
          //Verifica que la cedula no sea repetida
          if (cedulaRepetida) { 
            alert('La cédula ya fue registrada para otro asesor.');
            return false; //No deja avanzar 
          }
          //Verifica que el sea mayor de 18 años
          if (!esMayorDeEdad(newAsesor.fecha_nacimiento)) {
            alert("El asesor debe ser mayor de edad."); 
            return false;
          }
          //Verifica que solo hayan número positivos
          if (newAsesor.meta_colones <= 0 || newAsesor.meta_dolares <= 0) {
            alert("Las metas deben ser mayores que 0.");
            return false;
          }
          return true;
        };

          if (!validarDatos()) {
            return; // Si la validación falla, no se puede continuar.
        }
       
        try {
          if (isEditing && currentAsesor) {
            //Si se está editando, se actualiza el asesor
            const updated = await updateAsesor(currentAsesor.id!, asesorToSubmit);
            //Se hace un reemplazo con el asesor actualizado
            setAsesores(asesores.map(a => a.id === updated.id ? updated : a));
            setIsEditing(false);
            setCurrentAsesor(null);
          }else{
          const createdAsesor = await createAsesor(newAsesor);
          setAsesores([...asesores, createdAsesor]); 
        }
          //Se limpia el formulario luego de cada acción(crear o editar un asesor)
          setNewAsesor({
            cedula:'',
            nombre_1: '',
            nombre_2: '',
            apellido_1: '',
            apellido_2: '',
            fecha_nacimiento:'',
            meta_colones: 0,
            meta_dolares: 0,
          });
          
        } catch (error) {
          console.error('Error al crear el asesor:', error);
        }
      };

  // Inicia la edición de un asesor
  //Se llena el formulario con los datos que se desean actualizar
  const handleEdit = (asesor: Asesor) => {
    setCurrentAsesor(asesor);
    setIsEditing(true);
    setNewAsesor(asesor); 
  };

  // Maneja el eliminar un asesor
  const handleDelete = async (id: number) => {
    //Se pide una confirmación
    if (window.confirm('¿Está seguro de eliminar este asesor?')) {
      try {
        await deleteAsesor(id);
        loadAsesores(); //Se recarga la lista nuevamente, pero ahora con sin el asesor eliminado
      } catch (err) {
        setError('Error al eliminar el asesor');
      }
    }
  };

  // Manejador para actualizar el estado durante la edición
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    //Guardar las metas como numeros y no como strings
    const parsedValue = name === 'meta_colones' || name === 'meta_dolares' ? Number(value) : value;

    if (isEditing && currentAsesor) {
      setCurrentAsesor({ ...currentAsesor, [name]: parsedValue }); //actualiza al asesor que se está editando
      setNewAsesor({ ...newAsesor, [name]: parsedValue });
    } else {
      setNewAsesor({ ...newAsesor, [name]: parsedValue });
    }
  };
  
  //Disposición en la página asesores desde administrador.
    return (
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Asesores de Crédito</h1>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor='cedula' className="block text-sm font-medium text-gray-700">Cédula</label>
                <input
                type="text"
                id="cedula"
                name="cedula"
                value={isEditing && currentAsesor ? currentAsesor.cedula : newAsesor.cedula}
                onChange={handleInputChange}
                placeholder="Cédula"
                required //Campo obligatorio
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
            <label htmlFor='nombres' className="block text-sm font-medium text-gray-700">Nombre</label>
            <div className="flex space-x-4">
                <input
                type="text"
                id="nombre1"
                name="nombre_1"
                value={isEditing && currentAsesor ? currentAsesor.nombre_1 : newAsesor.nombre_1}
                onChange={handleInputChange}
                placeholder="Primer nombre"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                type="text"
                id= "nombre2"
                name="nombre_2"
                value={isEditing && currentAsesor ? currentAsesor.nombre_2 : newAsesor.nombre_2}
                onChange={handleInputChange}
                placeholder="Segundo nombre"
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            </div>

            <div className="mb-4">
            <label htmlFor='apellidos' className="block text-sm font-medium text-gray-700">
                Apellidos</label>
            <div className="flex space-x-4">  
              <input
                type="text"
                id= "apellido1"
                name="apellido_1"
                value={isEditing && currentAsesor ? currentAsesor.apellido_1 : newAsesor.apellido_1}
                onChange={handleInputChange}
                placeholder="Primer apellido"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              <input
                type="text"
                id= "apellido2"
                name="apellido_2"
                value={isEditing && currentAsesor ? currentAsesor.apellido_2 : newAsesor.apellido_2}
                onChange={handleInputChange}
                placeholder="Segundo apellido"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>
            </div>

            <div className="mb-4">
              <label htmlFor='fechanacimiento' className="block text-sm font-medium text-gray-700">
                Fecha de nacimiento</label>
              <input
                type="date"
                id="fechanacimiento"
                name="fecha_nacimiento"
                value={isEditing && currentAsesor ? currentAsesor.fecha_nacimiento : newAsesor.fecha_nacimiento} 
                onChange={handleInputChange}
                placeholder='Digite la fecha'
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor='metacolones' className="block text-sm font-medium text-gray-700">
                Meta en colones</label>
              <input
                type="number"
                id="metacolones"
                name="meta_colones"
                value={isEditing && currentAsesor ? currentAsesor.meta_colones || '' : newAsesor.meta_colones || ''}
                onChange={handleInputChange}
                placeholder="Meta en colones"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor='metadolares' className="block text-sm font-medium text-gray-700">
                Meta en dólares</label>
              <input
                type="number"
                id="metadolares"
                name="meta_dolares"
                value={isEditing && currentAsesor ? currentAsesor.meta_dolares || '' : newAsesor.meta_dolares || ''}
                onChange={handleInputChange}
                placeholder="Meta en dólares"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div >
            <button type="submit"
             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                    {isEditing ? 'Actualizar' : 'Crear'} Asesor
            </button>
          </form>
          <div className="mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ID
                            </th>  
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cédula
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Primer Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Segundo Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Primer Apellido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Segundo Apellido
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Fecha de Nacimiento
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Meta en colones
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Meta en doláres
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th> 
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {asesores.map((asesor) => (
                        <tr key={asesor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asesor.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asesor.cedula}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.nombre_1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.nombre_2}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.apellido_1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.apellido_2}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.fecha_nacimiento} </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.meta_colones}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.meta_dolares}</td>
                        <td className="px-4 py-2 border">
                        <button onClick={() => handleEdit(asesor)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => asesor.id && handleDelete(asesor.id)} className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                        </td>
                        </tr> 
                        ))}
                    </tbody>
                </table>
            </div>
            {error && <div className="text-red-500 mt-4">{error}</div>}
        </div>
    );
};  
export default Asesores;
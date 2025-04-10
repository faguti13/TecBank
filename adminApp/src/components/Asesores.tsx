import React, { useState, useEffect } from 'react'; //Actualiza el estado
import {  getAllAsesores, createAsesor  } from '../services/asesoresService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

//Creación de un nuevo asesor 

interface Asesor{
    id?:number;
    cedula:number;
    nombre_1:string;
    nombre_2:string;                                                         
    apellido_1:string;
    apellido_2:string;
    fecha_nacimiento:string;
    meta_colones:number;
    meta_dolares: number;
}

const Asesores: React.FC = () => {
    const [asesores, setAsesores] = useState<Asesor[]>([]);
    const [newAsesor, setNewAsesor] = useState<Asesor>({
      id: undefined,
      cedula:0,
      nombre_1: '',
      nombre_2: '',
      apellido_1: '',
      apellido_2: '',
      fecha_nacimiento: '',
      meta_colones: 0,
      meta_dolares: 0,
    });
  
    // El efecto podría usarse para obtener los asesores desde un servicio, si se necesita
    useEffect(() => {
        const loadAsesores = async () => {
          try {
            const data = await getAllAsesores();
            setAsesores(data);  
          } catch (error) {
            console.error('Error al cargar los asesores:', error);
          }
        };
        loadAsesores();
      }, []);  
    
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          // Crear un nuevo asesor y actualizar la lista
          const createdAsesor = await createAsesor(newAsesor);
          setAsesores([...asesores, createdAsesor]);  
          setNewAsesor({
            cedula:0,
            nombre_1: '',
            nombre_2: '',
            apellido_1: '',
            apellido_2: '',
            fecha_nacimiento: '',
            meta_colones: 0,
            meta_dolares: 0,
          });
        } catch (error) {
          console.error('Error al crear el asesor:', error);
        }
      };
  
    return (
        <div className="p-6 bg-white rounded-lg shadow">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Asesores de Crédito</h1>
          <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor='cedula' className="block text-sm font-medium text-gray-700">Cédula</label>
                <input
                type="number"
                id="cedula"
                value={newAsesor.cedula}
                onChange={(e) => setNewAsesor({ ...newAsesor, cedula: Number(e.target.value) })}
                placeholder="Cédula"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="mb-4">
            <label htmlFor='nombres' className="block text-sm font-medium text-gray-700">Nombre</label>
            <div className="flex space-x-4">
                <input
                type="text"
                id="nombres"
                value={newAsesor.nombre_1}
                onChange={(e) => setNewAsesor({ ...newAsesor, nombre_1: e.target.value })}
                placeholder="Primer nombre"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <input
                type="text"
                id= "nombres"
                value={newAsesor.nombre_2}
                onChange={(e) => setNewAsesor({ ...newAsesor, nombre_2: e.target.value })}
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
                id= "apellidos"
                value={newAsesor.apellido_1}
                onChange={(e) => setNewAsesor({ ...newAsesor, apellido_1: e.target.value })}
                placeholder="Primer apellido"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              <input
                type="text"
                id= "apellidos"
                value={newAsesor.apellido_2}
                onChange={(e) => setNewAsesor({ ...newAsesor, apellido_2: e.target.value })}
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
                value={newAsesor.fecha_nacimiento}
                onChange={(e) => setNewAsesor({ ...newAsesor, fecha_nacimiento: e.target.value })}
                placeholder='Digite la fecha'
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="mb-4">
              <label htmlFor='metacolones' className="block text-sm font-medium text-gray-700">
                Meta en colones</label>
              <input
                type="number"
                id="metacolones"
                value={newAsesor.meta_colones}
                onChange={(e) => setNewAsesor({ ...newAsesor, meta_colones: Number(e.target.value) })}
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
                value={newAsesor.meta_dolares}
                onChange={(e) => setNewAsesor({ ...newAsesor, meta_dolares: Number(e.target.value) })}
                placeholder="Meta en dólares"
                required
                className="block w-1/4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div >
            <button type="submit"
             className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Crear Asesor
            </button>
          </form>
          <div className="mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
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
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {asesores.map((asesor) => (
                        <tr key={asesor.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{asesor.cedula}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.nombre_1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.nombre_2}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.apellido_1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.apellido_2}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.fecha_nacimiento}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.meta_colones}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{asesor.meta_dolares}</td>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
  export default Asesores;
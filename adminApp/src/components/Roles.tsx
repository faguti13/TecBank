import React, { useState, useEffect } from 'react';
import { rolService } from '../services/rolService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Rol {
    id?: number;
    nombre: string;
    descripcion: string;
}

const Roles: React.FC = () => {
    const [roles, setRoles] = useState<Rol[]>([]);
    const [currentRol, setCurrentRol] = useState<Rol>({ nombre: '', descripcion: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const data = await rolService.getAll();
            setRoles(data);
        } catch (err) {
            setError('Error al cargar los roles');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentRol.id) {
                await rolService.update(currentRol.id, currentRol);
            } else {
                await rolService.create(currentRol);
            }
            setCurrentRol({ nombre: '', descripcion: '' });
            setIsEditing(false);
            loadRoles();
        } catch (err) {
            setError('Error al guardar el rol');
        }
    };

    const handleEdit = (rol: Rol) => {
        setCurrentRol(rol);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar este rol?')) {
            try {
                await rolService.delete(id);
                loadRoles();
            } catch (err) {
                setError('Error al eliminar el rol');
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Roles</h2>
            
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div>
                    <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <input
                        type="text"
                        id="nombre"
                        value={currentRol.nombre}
                        onChange={(e) => setCurrentRol({ ...currentRol, nombre: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        id="descripcion"
                        value={currentRol.descripcion}
                        onChange={(e) => setCurrentRol({ ...currentRol, descripcion: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={3}
                    />
                </div>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isEditing ? 'Actualizar' : 'Crear'} Rol
                </button>
            </form>

            <div className="mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {roles.map((rol) => (
                            <tr key={rol.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {rol.nombre}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {rol.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(rol)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => rol.id && handleDelete(rol.id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        <TrashIcon className="h-5 w-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Roles; 
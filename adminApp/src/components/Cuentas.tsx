import React, { useState, useEffect } from 'react';
import { cuentaService } from '../services/cuentaService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface Cuenta {
    id?: number;
    numeroCuenta: string;
    descripcion: string;
    moneda: 'Colones' | 'Dólares' | 'Euros';
    tipoCuenta: 'Ahorros' | 'Corriente';
    nombreCliente: string;
}

const Cuentas: React.FC = () => {
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [currentCuenta, setCurrentCuenta] = useState<Cuenta>({
        numeroCuenta: '',
        descripcion: '',
        moneda: 'Colones',
        tipoCuenta: 'Ahorros',
        nombreCliente: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        loadCuentas();
    }, []);

    const loadCuentas = async () => {
        try {
            const data = await cuentaService.getAll();
            setCuentas(data);
        } catch (err) {
            setError('Error al cargar las cuentas');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentCuenta.id) {
                await cuentaService.update(currentCuenta.id, currentCuenta);
            } else {
                await cuentaService.create(currentCuenta);
            }
            setCurrentCuenta({
                numeroCuenta: '',
                descripcion: '',
                moneda: 'Colones',
                tipoCuenta: 'Ahorros',
                nombreCliente: ''
            });
            setIsEditing(false);
            loadCuentas();
        } catch (err) {
            setError('Error al guardar la cuenta');
        }
    };

    const handleEdit = (cuenta: Cuenta) => {
        setCurrentCuenta(cuenta);
        setIsEditing(true);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('¿Está seguro de eliminar esta cuenta?')) {
            try {
                await cuentaService.delete(id);
                loadCuentas();
            } catch (err) {
                setError('Error al eliminar la cuenta');
            }
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Cuentas</h2>
            
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="mb-6 space-y-4">
                <div>
                    <label htmlFor="numeroCuenta" className="block text-sm font-medium text-gray-700">
                        Número de Cuenta
                    </label>
                    <input
                        type="text"
                        id="numeroCuenta"
                        value={currentCuenta.numeroCuenta}
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, numeroCuenta: e.target.value })}
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
                        value={currentCuenta.descripcion}
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, descripcion: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        rows={2}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="moneda" className="block text-sm font-medium text-gray-700">
                        Moneda
                    </label>
                    <select
                        id="moneda"
                        value={currentCuenta.moneda}
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, moneda: e.target.value as 'Colones' | 'Dólares' | 'Euros' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="Colones">Colones</option>
                        <option value="Dólares">Dólares</option>
                        <option value="Euros">Euros</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="tipoCuenta" className="block text-sm font-medium text-gray-700">
                        Tipo de Cuenta
                    </label>
                    <select
                        id="tipoCuenta"
                        value={currentCuenta.tipoCuenta}
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, tipoCuenta: e.target.value as 'Ahorros' | 'Corriente' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="Ahorros">Ahorros</option>
                        <option value="Corriente">Corriente</option>
                    </select>
                </div>
                
                <div>
                    <label htmlFor="nombreCliente" className="block text-sm font-medium text-gray-700">
                        Nombre del Cliente
                    </label>
                    <input
                        type="text"
                        id="nombreCliente"
                        value={currentCuenta.nombreCliente}
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, nombreCliente: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    {isEditing ? 'Actualizar' : 'Crear'} Cuenta
                </button>
            </form>

            <div className="mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Número de Cuenta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Moneda
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tipo de Cuenta
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cuentas.map((cuenta) => (
                            <tr key={cuenta.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {cuenta.numeroCuenta}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cuenta.descripcion}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cuenta.moneda}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cuenta.tipoCuenta}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cuenta.nombreCliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button
                                        onClick={() => handleEdit(cuenta)}
                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => cuenta.id && handleDelete(cuenta.id)}
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

export default Cuentas;
import React, { useState, useEffect } from 'react';
import { cuentaService } from '../services/cuentaService';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { registrarDeposito, registrarRetiro } from '../services/transaccionService';

interface Cuenta {
    id?: number;
    numeroCuenta: string;
    descripcion: string;
    moneda: 'CRC' | 'USD' | 'EUR';
    tipoCuenta: 'Ahorros' | 'Corriente';
    cedulaCliente: string;
    saldo: number;
}

interface TransaccionModalProps {
    cuenta: Cuenta;
    tipo: 'deposito' | 'retiro';
    onClose: () => void;
    onSuccess: () => void;
}

const TransaccionModal: React.FC<TransaccionModalProps> = ({ cuenta, tipo, onClose, onSuccess }) => {
    const [monto, setMonto] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const montoNumerico = parseFloat(monto);
            if (isNaN(montoNumerico) || montoNumerico <= 0) {
                throw new Error('El monto debe ser un número positivo');
            }

            if (tipo === 'deposito') {
                await registrarDeposito({
                    cuentaId: cuenta.id!,
                    monto: montoNumerico,
                    descripcion,
                    monedaOrigen: cuenta.moneda
                });
            } else {
                await registrarRetiro({
                    cuentaId: cuenta.id!,
                    monto: montoNumerico,
                    descripcion,
                    monedaOrigen: cuenta.moneda
                });
            }

            onSuccess();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al procesar la operación');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                    <h3 className="text-lg font-medium text-gray-900">
                        {tipo === 'deposito' ? 'Realizar Depósito' : 'Realizar Retiro'}
                    </h3>
                    <form onSubmit={handleSubmit} className="mt-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Monto ({cuenta.moneda})
                            </label>
                            <input
                                type="number"
                                value={monto}
                                onChange={(e) => setMonto(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                                step="0.01"
                                min="0"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Descripción</label>
                            <input
                                type="text"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        {error && (
                            <div className="mb-4 text-red-600 text-sm">{error}</div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {loading ? 'Procesando...' : 'Confirmar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

const Cuentas: React.FC = () => {
    const [cuentas, setCuentas] = useState<Cuenta[]>([]);
    const [currentCuenta, setCurrentCuenta] = useState<Cuenta>({
        numeroCuenta: '',
        descripcion: '',
        moneda: 'CRC',
        tipoCuenta: 'Ahorros',
        cedulaCliente: '',
        saldo: 0
    });
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);
    const [modalType, setModalType] = useState<'deposito' | 'retiro' | null>(null);

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
                moneda: 'CRC',
                tipoCuenta: 'Ahorros',
                cedulaCliente: '',
                saldo: 0
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

    const handleOperacion = (cuenta: Cuenta, tipo: 'deposito' | 'retiro') => {
        setSelectedCuenta(cuenta);
        setModalType(tipo);
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
                        Número de Cuenta (Formato IBAN: CR## BBB ##############)
                    </label>
                    <input
                        type="text"
                        id="numeroCuenta"
                        value={currentCuenta.numeroCuenta}
                        onChange={(e) => {
                            const value = e.target.value.toUpperCase();
                            // Permitir escribir CR y números, eliminando cualquier otro carácter
                            const cleanValue = value.replace(/[^CR0-9]/g, '');
                            if (cleanValue.length <= 22) {
                                setCurrentCuenta({ ...currentCuenta, numeroCuenta: cleanValue });
                            }
                        }}
                        pattern="^CR\d{20}$"
                        maxLength={22}
                        placeholder="CR##BBB##############"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        required
                    />
                    <p className="mt-1 text-sm text-gray-500">
                        Formato: CR + 2 dígitos de control + 3 dígitos del banco + 14 dígitos de cuenta
                    </p>
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
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, moneda: e.target.value as 'CRC' | 'USD' | 'EUR' })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                        <option value="CRC">Colones (CRC)</option>
                        <option value="USD">Dólares (USD)</option>
                        <option value="EUR">Euros (EUR)</option>
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
                    <label htmlFor="cedulaCliente" className="block text-sm font-medium text-gray-700">
                        Cédula del Cliente
                    </label>
                    <input
                        type="text"
                        id="cedulaCliente"
                        value={currentCuenta.cedulaCliente}
                        onChange={(e) => setCurrentCuenta({ ...currentCuenta, cedulaCliente: e.target.value })}
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
                                Cédula Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Saldo
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
                                    {cuenta.cedulaCliente}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {cuenta.saldo?.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => handleOperacion(cuenta, 'deposito')}
                                        className="text-green-600 hover:text-green-900"
                                    >
                                        Depositar
                                    </button>
                                    <button
                                        onClick={() => handleOperacion(cuenta, 'retiro')}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Retirar
                                    </button>
                                    <button
                                        onClick={() => handleEdit(cuenta)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <PencilIcon className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cuenta.id!)}
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

            {selectedCuenta && modalType && (
                <TransaccionModal
                    cuenta={selectedCuenta}
                    tipo={modalType}
                    onClose={() => {
                        setSelectedCuenta(null);
                        setModalType(null);
                    }}
                    onSuccess={loadCuentas}
                />
            )}
        </div>
    );
};

export default Cuentas;
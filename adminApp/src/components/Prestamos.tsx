import React, { useState, useEffect } from 'react';
import { prestamoService, Prestamo, PagoPrestamo, CalendarioPago, TipoMoneda } from '../services/prestamoService';
import { format } from 'date-fns';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface ErrorMessage {
    title: string;
    message: string;
    type: 'error' | 'warning' | 'info';
}

const Prestamos: React.FC = () => {
    const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
    const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [showPagoForm, setShowPagoForm] = useState(false);
    const [showCalendario, setShowCalendario] = useState(false);
    const [error, setError] = useState<ErrorMessage | null>(null);

    const [formData, setFormData] = useState({
        montoOriginal: '',
        cedulaCliente: '',
        asesorId: '',
        tasaInteres: '',
        plazoMeses: '',
        moneda: TipoMoneda.Colones
    });

    const [pagoData, setPagoData] = useState({
        monto: '',
        esPagoExtraordinario: false
    });

    useEffect(() => {
        loadPrestamos();
    }, []);

    const loadPrestamos = async () => {
        try {
            const data = await prestamoService.getAll();
            setPrestamos(data);
        } catch (err) {
            setError({
                title: "Error de carga",
                message: "No se pudieron cargar los préstamos. Por favor, intente nuevamente.",
                type: "error"
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null); // Limpiar error anterior
        try {
            const prestamo = {
                montoOriginal: parseFloat(formData.montoOriginal),
                cedulaCliente: formData.cedulaCliente,
                asesorId: parseInt(formData.asesorId),
                tasaInteres: parseFloat(formData.tasaInteres),
                plazoMeses: parseInt(formData.plazoMeses),
                moneda: formData.moneda,
                saldo: parseFloat(formData.montoOriginal)
            };

            const createdPrestamo = await prestamoService.create(prestamo);
            
            setShowForm(false);
            setFormData({ 
                montoOriginal: '', 
                cedulaCliente: '', 
                asesorId: '', 
                tasaInteres: '', 
                plazoMeses: '',
                moneda: TipoMoneda.Colones 
            });
            loadPrestamos();
        } catch (error: unknown) {
            console.error('Error completo:', error);
            let errorMessage: ErrorMessage;
            const err = error as Error;
            
            if (err.message.includes("No se encontró el cliente")) {
                errorMessage = {
                    title: "Cliente no encontrado",
                    message: "La cédula ingresada no existe en el sistema. Por favor, verifique la cédula e intente nuevamente.",
                    type: "error"
                };
            } else if (err.message.includes("El asesor con ID")) {
                errorMessage = {
                    title: "Asesor no encontrado",
                    message: "El ID de asesor ingresado no existe en el sistema. Por favor, verifique el ID e intente nuevamente.",
                    type: "error"
                };
            } else {
                errorMessage = {
                    title: "Error al crear el préstamo",
                    message: err.message || "Ha ocurrido un error inesperado. Por favor, intente nuevamente.",
                    type: "error"
                };
            }
            setError(errorMessage);
        }
    };

    const handlePagoSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPrestamo) return;

        try {
            const pago: PagoPrestamo = {
                monto: parseFloat(pagoData.monto),
                fechaPago: new Date(),
                esPagoExtraordinario: pagoData.esPagoExtraordinario
            };

            await prestamoService.registrarPago(selectedPrestamo.id!, pago);
            setShowPagoForm(false);
            setPagoData({ monto: '', esPagoExtraordinario: false });
            loadPrestamos();
        } catch (err) {
            setError({
                title: "Error al registrar pago",
                message: "No se pudo registrar el pago. Por favor, verifique los datos e intente nuevamente.",
                type: "error"
            });
        }
    };

    const formatMoney = (amount: number, moneda: TipoMoneda) => {
        const currency = moneda === TipoMoneda.Colones ? 'CRC' : 
                        moneda === TipoMoneda.Dolares ? 'USD' : 'EUR';
        return new Intl.NumberFormat('es-CR', {
            style: 'currency',
            currency: currency
        }).format(amount);
    };

    const ErrorAlert = ({ error, onClose }: { error: ErrorMessage, onClose: () => void }) => {
        const bgColor = error.type === 'error' ? 'bg-red-100' : 
                       error.type === 'warning' ? 'bg-yellow-100' : 
                       'bg-blue-100';
        
        const textColor = error.type === 'error' ? 'text-red-700' : 
                         error.type === 'warning' ? 'text-yellow-700' : 
                         'text-blue-700';
        
        const borderColor = error.type === 'error' ? 'border-red-400' : 
                           error.type === 'warning' ? 'border-yellow-400' : 
                           'border-blue-400';

        return (
            <div className="fixed top-4 right-4 z-50 max-w-md animate-slide-in">
                <div className={`${bgColor} border ${borderColor} ${textColor} px-4 py-3 rounded-lg shadow-lg`} role="alert">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="font-bold mb-1">{error.title}</p>
                            <p className="text-sm">{error.message}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="ml-4 hover:bg-gray-200 rounded-full p-1 transition-colors"
                        >
                            <XMarkIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Préstamos</h2>
            
            {error && (
                <ErrorAlert 
                    error={error} 
                    onClose={() => setError(null)}
                />
            )}

            <div className="mb-4">
                <button
                    onClick={() => setShowForm(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                    Crear Préstamo
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 z-40">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"></div>
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
                            <h3 className="text-lg font-medium mb-4">Nuevo Préstamo</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Monto Original
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.montoOriginal}
                                        onChange={(e) => setFormData({ ...formData, montoOriginal: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Cédula del Cliente
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.cedulaCliente}
                                        onChange={(e) => setFormData({ ...formData, cedulaCliente: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        ID del Asesor
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.asesorId}
                                        onChange={(e) => setFormData({ ...formData, asesorId: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Tasa de Interés (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.tasaInteres}
                                        onChange={(e) => setFormData({ ...formData, tasaInteres: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Plazo (meses)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.plazoMeses}
                                        onChange={(e) => setFormData({ ...formData, plazoMeses: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Moneda
                                    </label>
                                    <select
                                        value={formData.moneda}
                                        onChange={(e) => setFormData({ ...formData, moneda: e.target.value as TipoMoneda })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    >
                                        {Object.values(TipoMoneda).map((moneda) => (
                                            <option key={moneda} value={moneda}>
                                                {moneda}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowForm(false)}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {showPagoForm && selectedPrestamo && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-lg font-medium mb-4">Registrar Pago</h3>
                        <form onSubmit={handlePagoSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Monto del Pago
                                </label>
                                <input
                                    type="number"
                                    value={pagoData.monto}
                                    onChange={(e) => setPagoData({ ...pagoData, monto: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="esPagoExtraordinario"
                                    checked={pagoData.esPagoExtraordinario}
                                    onChange={(e) => setPagoData({ ...pagoData, esPagoExtraordinario: e.target.checked })}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="esPagoExtraordinario" className="ml-2 block text-sm text-gray-900">
                                    Es pago extraordinario
                                </label>
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPagoForm(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                                >
                                    Registrar Pago
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showCalendario && selectedPrestamo && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">
                                Calendario de Pagos - Préstamo #{selectedPrestamo.id}
                            </h3>
                            <button
                                onClick={() => setShowCalendario(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <span className="text-2xl">&times;</span>
                            </button>
                        </div>
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cuota
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Fecha
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Amortización
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Interés
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Cuota Total
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Saldo
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {selectedPrestamo?.calendarioPagos?.map((cuota) => (
                                    <tr key={cuota.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {cuota.numeroCuota}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {format(new Date(cuota.fechaProgramada), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatMoney(cuota.montoAmortizacion, selectedPrestamo.moneda)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatMoney(cuota.montoInteres, selectedPrestamo.moneda)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatMoney(cuota.montoCuota, selectedPrestamo.moneda)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {cuota.saldoProyectado ? formatMoney(cuota.saldoProyectado, selectedPrestamo.moneda) : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <div className="mt-8">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Cédula Cliente
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Monto Original
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Saldo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tasa Interés
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Plazo
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Moneda
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Asesor
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {prestamos.map((prestamo) => (
                            <tr key={prestamo.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {prestamo.cedulaCliente || prestamo.clienteId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatMoney(prestamo.montoOriginal, prestamo.moneda)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatMoney(prestamo.saldo, prestamo.moneda)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {prestamo.tasaInteres}%
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {prestamo.plazoMeses} meses
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {prestamo.moneda}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {prestamo.asesorId}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => {
                                            setSelectedPrestamo(prestamo);
                                            setShowCalendario(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Ver Calendario
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedPrestamo(prestamo);
                                            setShowPagoForm(true);
                                        }}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Registrar Pago
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

// Agregar estos estilos al archivo CSS global o al tailwind.config.js
const styles = `
@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}

.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}
`;

export default Prestamos; 
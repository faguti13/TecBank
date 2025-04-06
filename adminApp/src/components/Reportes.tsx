import React, { useState } from 'react';
import { reporteService } from '../services/reporteService';

const Reportes: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const generarReporteMorosidad = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);
            
            console.log('Solicitando datos para el reporte de morosidad...');
            const datos = await reporteService.generarReporteMorosidad();
            
            if (!datos || datos.length === 0) {
                setError('No hay préstamos en estado de morosidad para generar el reporte.');
                return;
            }

            console.log('Generando PDF con los datos recibidos...');
            reporteService.generarPDFMorosidad(datos);
            setSuccess('Reporte generado exitosamente. El archivo PDF se ha descargado.');
        } catch (err) {
            console.error('Error al generar reporte:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(`Error al generar el reporte de morosidad: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Reportes</h2>
            
            {error && (
                <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
                    {success}
                </div>
            )}

            <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                    <h3 className="text-lg font-medium mb-2">Reporte de Morosidad</h3>
                    <p className="text-gray-600 mb-4">
                        Este reporte muestra los préstamos en estado de morosidad, incluyendo información del cliente,
                        número de cuotas vencidas y monto adeudado.
                    </p>
                    <button
                        onClick={generarReporteMorosidad}
                        disabled={loading}
                        className={`px-4 py-2 text-sm font-medium text-white rounded-md 
                            ${loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 transition-colors duration-200'
                            } flex items-center`}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Generando...
                            </>
                        ) : (
                            'Generar Reporte'
                        )}
                    </button>
                </div>

                {/* Espacio para futuros tipos de reportes */}
                <div className="p-4 border rounded-lg bg-gray-50">
                    <h3 className="text-lg font-medium mb-2 text-gray-500">Más Reportes</h3>
                    <p className="text-gray-500">
                        Próximamente se agregarán más tipos de reportes en esta sección.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Reportes; 
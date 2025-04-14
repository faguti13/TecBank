import React, { useState, useEffect } from 'react';
import { Transaccion, getTransaccionesByCuenta } from '../services/transaccionesService';
import { formatearMonto, getMonedaSymbol, TipoMoneda } from '../services/monedaService';

interface TransaccionesHistorialProps {
  cuentaId: number;
  monedaCuenta: TipoMoneda;
  onClose: () => void;
}

const TransaccionesHistorial: React.FC<TransaccionesHistorialProps> = ({ cuentaId, monedaCuenta, onClose }) => {
  const [transacciones, setTransacciones] = useState<Transaccion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransacciones = async () => {
      try {
        console.log('Fetching transactions for account:', cuentaId);
        const data = await getTransaccionesByCuenta(cuentaId);
        console.log('Received transactions:', data);
        if (!Array.isArray(data)) {
          throw new Error('La respuesta no es un array de transacciones');
        }
        setTransacciones(data);
      } catch (err) {
        console.error('Error detallado:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar las transacciones');
      } finally {
        setLoading(false);
      }
    };

    fetchTransacciones();
  }, [cuentaId]);

  const formatFecha = (fecha: string) => {
    return new Date(fecha).toLocaleString('es-CR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTipoTransaccionStyle = (tipo: string) => {
    switch (tipo) {
      case 'Depósito':
        return 'text-green-600';
      case 'Retiro':
        return 'text-red-600';
      case 'Transferencia':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  const getMonto = (transaccion: Transaccion) => {
    // Si la cuenta actual es la cuenta origen, usar monto original
    if (transaccion.cuentaOrigenId === cuentaId) {
      return {
        monto: transaccion.monto,
        moneda: transaccion.monedaOrigen
      };
    }
    // Si la cuenta actual es la cuenta destino, usar monto destino
    return {
      monto: transaccion.montoDestino,
      moneda: transaccion.monedaDestino
    };
  };

  const esTransaccionSaliente = (transaccion: Transaccion) => {
    return transaccion.tipo === 'Retiro' || 
           (transaccion.tipo === 'Transferencia' && transaccion.cuentaOrigenId === cuentaId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Historial de Transacciones</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error ? (
          <div className="p-4 text-red-600 bg-red-100 rounded-md">
            {error}
          </div>
        ) : transacciones.length === 0 ? (
          <div className="text-center p-4 text-gray-600">
            No hay transacciones para mostrar
          </div>
        ) : (
          <div className="space-y-4 max-h-[60vh] overflow-y-auto">
            {transacciones.map((transaccion) => {
              const { monto, moneda } = getMonto(transaccion);
              const esSaliente = esTransaccionSaliente(transaccion);
              
              return (
                <div
                  key={transaccion.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className={`font-semibold ${getTipoTransaccionStyle(transaccion.tipo)}`}>
                        {transaccion.tipo}
                      </p>
                      <p className="text-sm text-gray-600">{transaccion.descripcion}</p>
                      <p className="text-xs text-gray-500">{formatFecha(transaccion.fecha)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">
                        {esSaliente ? '-' : '+'}
                        {getMonedaSymbol(moneda)}
                        {formatearMonto(monto, moneda)}
                      </p>
                      <p className="text-xs text-gray-500">{transaccion.estado}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default TransaccionesHistorial; 
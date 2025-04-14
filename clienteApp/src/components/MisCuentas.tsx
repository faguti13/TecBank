import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';
import TransaccionesHistorial from './TransaccionesHistorial';
import { realizarTransferencia, registrarDeposito, registrarRetiro } from '../services/transaccionesService';
import { TipoMoneda } from '../services/monedaService';
import { Cuenta, buscarCuentaPorNumero } from '../services/cuentaService';

interface TransaccionModalProps {
  cuenta: Cuenta;
  tipo: 'transferencia' | 'deposito' | 'retiro';
  onClose: () => void;
  onSuccess: () => void;
  cuentasDisponibles?: Cuenta[];
}

const TransaccionModal: React.FC<TransaccionModalProps> = ({ cuenta, tipo, onClose, onSuccess, cuentasDisponibles }) => {
  const [monto, setMonto] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [cuentaDestino, setCuentaDestino] = useState('');
  const [numeroCuentaExterna, setNumeroCuentaExterna] = useState('');
  const [cuentaExterna, setCuentaExterna] = useState<Cuenta | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tipoTransferencia, setTipoTransferencia] = useState<'interna' | 'externa'>('interna');
  const [buscandoCuenta, setBuscandoCuenta] = useState(false);

  const buscarCuentaExterna = async () => {
    if (!numeroCuentaExterna) return;
    
    setBuscandoCuenta(true);
    setError('');
    setCuentaExterna(null);
    
    try {
      const cuentaEncontrada = await buscarCuentaPorNumero(numeroCuentaExterna);
      if (cuentaEncontrada.id === cuenta.id) {
        throw new Error('No puedes transferir a la misma cuenta');
      }
      setCuentaExterna(cuentaEncontrada);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al buscar la cuenta');
      setCuentaExterna(null);
    } finally {
      setBuscandoCuenta(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const montoNumerico = parseFloat(monto);
      if (isNaN(montoNumerico) || montoNumerico <= 0) {
        throw new Error('El monto debe ser un número positivo');
      }

      switch (tipo) {
        case 'transferencia': {
          let cuentaDestinoId: number;
          
          if (tipoTransferencia === 'interna') {
            if (!cuentaDestino) throw new Error('Seleccione una cuenta destino');
            cuentaDestinoId = parseInt(cuentaDestino);
          } else {
            if (!cuentaExterna) throw new Error('Busque y seleccione una cuenta destino válida');
            cuentaDestinoId = cuentaExterna.id;
          }

          await realizarTransferencia({
            cuentaOrigenId: cuenta.id,
            cuentaDestinoId,
            monto: montoNumerico,
            descripcion,
            monedaOrigen: cuenta.moneda as TipoMoneda
          });
          break;
        }
        case 'deposito':
          await registrarDeposito({
            cuentaId: cuenta.id,
            monto: montoNumerico,
            descripcion,
            monedaOrigen: cuenta.moneda as TipoMoneda
          });
          break;
        case 'retiro':
          await registrarRetiro({
            cuentaId: cuenta.id,
            monto: montoNumerico,
            descripcion,
            monedaOrigen: cuenta.moneda as TipoMoneda
          });
          break;
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold capitalize">{tipo}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tipo === 'transferencia' && (
            <>
              <div className="flex space-x-4 mb-4">
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    tipoTransferencia === 'interna'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setTipoTransferencia('interna')}
                >
                  Mis Cuentas
                </button>
                <button
                  type="button"
                  className={`flex-1 py-2 px-4 rounded-md ${
                    tipoTransferencia === 'externa'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                  onClick={() => setTipoTransferencia('externa')}
                >
                  Otra Cuenta
                </button>
              </div>

              {tipoTransferencia === 'interna' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Cuenta Destino</label>
                  <select
                    value={cuentaDestino}
                    onChange={(e) => setCuentaDestino(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  >
                    <option value="">Seleccione una cuenta</option>
                    {cuentasDisponibles?.filter(c => c.id !== cuenta.id).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.numeroCuenta} - {c.descripcion} ({c.moneda})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Número de Cuenta</label>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={numeroCuentaExterna}
                        onChange={(e) => setNumeroCuentaExterna(e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="CR + 20 dígitos"
                      />
                      <button
                        type="button"
                        onClick={buscarCuentaExterna}
                        disabled={buscandoCuenta || !numeroCuentaExterna}
                        className="mt-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                      >
                        {buscandoCuenta ? '...' : 'Buscar'}
                      </button>
                    </div>
                  </div>

                  {cuentaExterna && (
                    <div className="p-4 bg-gray-50 rounded-md">
                      <h3 className="font-medium text-gray-900">Detalles de la cuenta:</h3>
                      <p className="text-sm text-gray-600">Titular: {cuentaExterna.cedulaCliente}</p>
                      <p className="text-sm text-gray-600">Tipo: {cuentaExterna.tipoCuenta}</p>
                      <p className="text-sm text-gray-600">Moneda: {cuentaExterna.moneda}</p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Monto</label>
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          {error && (
            <div className="p-3 text-red-600 bg-red-100 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading || (tipo === 'transferencia' && tipoTransferencia === 'externa' && !cuentaExterna)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Procesando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const MisCuentas: React.FC = () => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const [selectedCuenta, setSelectedCuenta] = useState<Cuenta | null>(null);
  const [modalType, setModalType] = useState<'transferencia' | 'deposito' | 'retiro' | null>(null);
  const [showTransacciones, setShowTransacciones] = useState(false);

  const fetchCuentas = async () => {
    if (!user?.cedula) {
      console.error('No hay cédula de usuario disponible');
      setError('No se puede cargar las cuentas sin identificación de usuario');
      setLoading(false);
      return;
    }

    try {
      const url = `${API_BASE_URL}/api/Cuentas/cliente/${user.cedula}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar las cuentas');
      }
      
      const data = await response.json();
      setCuentas(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error completo:', err);
      setError('Error al cargar las cuentas. Por favor, intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, [user]);

  const handleOperacion = (cuenta: Cuenta, tipo: 'transferencia' | 'deposito' | 'retiro') => {
    setSelectedCuenta(cuenta);
    setModalType(tipo);
  };

  const handleVerTransacciones = (cuenta: Cuenta) => {
    setSelectedCuenta(cuenta);
    setShowTransacciones(true);
  };

  const getMonedaSymbol = (moneda: string) => {
    switch (moneda.toUpperCase()) {
      case 'CRC':
        return '₡';
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      default:
        return moneda;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-100 rounded-md">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Mis Cuentas</h1>
        <div className="text-sm text-gray-500">
          Usuario: {user?.cedula}
        </div>
      </div>

      {cuentas.length === 0 ? (
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <p className="text-gray-600">No tienes cuentas registradas.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {cuentas.map((cuenta) => (
            <div key={cuenta.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Cuenta {cuenta.tipoCuenta}
                  </h3>
                  <p className="text-sm text-gray-500">{cuenta.numeroCuenta}</p>
                  <p className="text-sm text-gray-600 mt-1">{cuenta.descripcion}</p>
                </div>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                  {cuenta.moneda}
                </span>
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-600">Saldo disponible</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getMonedaSymbol(cuenta.moneda)} {cuenta.saldo.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleVerTransacciones(cuenta)}
                  className="col-span-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Ver Movimientos
                </button>
                <button
                  onClick={() => handleOperacion(cuenta, 'transferencia')}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Transferir
                </button>
                <button
                  onClick={() => handleOperacion(cuenta, 'retiro')}
                  className="px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Retirar
                </button>
                <button
                  onClick={() => handleOperacion(cuenta, 'deposito')}
                  className="col-span-2 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                >
                  Depositar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedCuenta && modalType && (
        <TransaccionModal
          cuenta={selectedCuenta}
          tipo={modalType}
          onClose={() => {
            setSelectedCuenta(null);
            setModalType(null);
          }}
          onSuccess={fetchCuentas}
          cuentasDisponibles={modalType === 'transferencia' ? cuentas : undefined}
        />
      )}

      {selectedCuenta && showTransacciones && (
        <TransaccionesHistorial
          cuentaId={selectedCuenta.id}
          monedaCuenta={selectedCuenta.moneda as TipoMoneda}
          onClose={() => {
            setSelectedCuenta(null);
            setShowTransacciones(false);
          }}
        />
      )}
    </div>
  );
};

export default MisCuentas; 
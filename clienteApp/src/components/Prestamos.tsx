import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { prestamoService, Prestamo, CalendarioPago, PagoPrestamo } from '../services/prestamoService';
import { cuentaService } from '../services/cuentaService';
import { TipoMoneda, formatearMonto, getMonedaSymbol, convertirMonto } from '../services/monedaService';

const Prestamos: React.FC = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [showPagoForm, setShowPagoForm] = useState(false);
  const [showCalendario, setShowCalendario] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cuentasCliente, setCuentasCliente] = useState<any[]>([]);
  const [pagoData, setPagoData] = useState({
    monto: '',
    esPagoExtraordinario: false,
    cuentaId: ''
  });

  const { user } = useAuth();

  useEffect(() => {
    console.log('Prestamos component mounted');
    console.log('Current user:', user);
    
    if (user?.cedula) {
      console.log('User cédula found, loading préstamos...');
      loadPrestamos();
      loadCuentasCliente();
    } else {
      console.log('No user cédula found');
      setError('No se encontró la cédula del usuario. Por favor, inicie sesión nuevamente.');
    }
  }, [user]);

  const loadPrestamos = async () => {
    try {
      console.log('Starting loadPrestamos...');
      setIsLoading(true);
      setError(null);

      if (!user?.cedula) {
        throw new Error('No se pudo identificar al usuario. Por favor, inicie sesión nuevamente.');
      }

      console.log('Fetching préstamos for cédula:', user.cedula);
      const data = await prestamoService.getPrestamosByCliente(user.cedula);
      console.log('Préstamos data received:', data);
      
      if (!Array.isArray(data)) {
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
      
      setPrestamos(data);
      console.log('Préstamos state updated');
    } catch (err) {
      console.error('Error in loadPrestamos:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los préstamos';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('Loading state finished');
    }
  };

  const loadCuentasCliente = async () => {
    try {
      if (!user?.cedula) return;
      const cuentas = await cuentaService.getCuentasByCliente(user.cedula);
      setCuentasCliente(cuentas);
    } catch (err) {
      console.error('Error al cargar cuentas:', err);
      setError('No se pudieron cargar las cuentas del cliente');
    }
  };

  const convertirTipoMoneda = (moneda: string): TipoMoneda => {
    // Normalizar el string de moneda
    const monedaNormalizada = moneda.toLowerCase();
    
    if (monedaNormalizada.includes('colon') || monedaNormalizada === 'crc') {
      return 'CRC';
    }
    if (monedaNormalizada.includes('dolar') || monedaNormalizada === 'usd') {
      return 'USD';
    }
    if (monedaNormalizada.includes('euro') || monedaNormalizada === 'eur') {
      return 'EUR';
    }
    console.warn('Tipo de moneda no reconocido:', moneda);
    return 'CRC';
  };

  const formatMoney = (amount: number, moneda: string) => {
    const tipoMoneda = convertirTipoMoneda(moneda);
    return `${getMonedaSymbol(tipoMoneda)} ${formatearMonto(amount, tipoMoneda)}`;
  };

  const handleMontoConversion = (monto: number, monedaOrigen: string, monedaDestino: string): number => {
    console.log('Convirtiendo monto:', { monto, monedaOrigen, monedaDestino });
    const tipoMonedaOrigen = convertirTipoMoneda(monedaOrigen);
    const tipoMonedaDestino = convertirTipoMoneda(monedaDestino);
    console.log('Tipos de moneda convertidos:', { tipoMonedaOrigen, tipoMonedaDestino });
    const montoConvertido = convertirMonto(monto, tipoMonedaOrigen, tipoMonedaDestino);
    console.log('Monto convertido:', montoConvertido);
    return montoConvertido;
  };

  const handlePagoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrestamo || !pagoData.cuentaId) return;

    try {
      const monto = parseFloat(pagoData.monto);
      const cuenta = cuentasCliente.find(c => c.id === parseInt(pagoData.cuentaId));
      
      if (!cuenta) {
        throw new Error('Cuenta no encontrada');
      }

      // Convertir el monto del préstamo a la moneda de la cuenta para verificar el saldo
      const montoEnMonedaCuenta = handleMontoConversion(
        monto,
        selectedPrestamo.moneda,
        cuenta.moneda
      );

      if (cuenta.saldo < montoEnMonedaCuenta) {
        throw new Error('Saldo insuficiente en la cuenta seleccionada');
      }

      const pago: PagoPrestamo = {
        monto: monto, // Monto en la moneda del préstamo
        fechaPago: new Date(),
        esPagoExtraordinario: pagoData.esPagoExtraordinario,
        cuentaId: parseInt(pagoData.cuentaId)
      };

      await prestamoService.registrarPago(selectedPrestamo.id, pago);
      setShowPagoForm(false);
      setPagoData({ monto: '', esPagoExtraordinario: false, cuentaId: '' });
      loadPrestamos();
      loadCuentasCliente();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar el pago';
      setError(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mis Préstamos</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : prestamos.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No tienes préstamos activos en este momento.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {prestamos.map((prestamo) => (
            <div key={prestamo.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Préstamo #{prestamo.id}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(prestamo.fechaCreacion), 'dd/MM/yyyy', { locale: es })}
                  </p>
                </div>
                <span className={`px-2 py-1 text-sm font-semibold rounded-full ${
                  prestamo.saldo === 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {prestamo.saldo === 0 ? 'Pagado' : 'Activo'}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monto original:</span>
                  <span className="font-medium">{formatMoney(prestamo.montoOriginal, prestamo.moneda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Saldo actual:</span>
                  <span className="font-medium">{formatMoney(prestamo.saldo, prestamo.moneda)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tasa de interés:</span>
                  <span className="font-medium">{prestamo.tasaInteres}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Plazo:</span>
                  <span className="font-medium">{prestamo.plazoMeses} meses</span>
                </div>
              </div>

              <div className="mt-6 space-x-3 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedPrestamo(prestamo);
                    setShowCalendario(true);
                  }}
                  className="px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100"
                >
                  Ver Calendario
                </button>
                {prestamo.saldo > 0 && (
                  <button
                    onClick={() => {
                      setSelectedPrestamo(prestamo);
                      setShowPagoForm(true);
                    }}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Realizar Pago
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Calendario de Pagos */}
      {showCalendario && selectedPrestamo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-[90%] max-w-4xl shadow-lg rounded-md bg-white">
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
            
            <div className="overflow-x-auto">
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
                  {selectedPrestamo.calendarioPagos.map((cuota) => (
                    <tr key={cuota.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {cuota.numeroCuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {format(new Date(cuota.fechaProgramada), 'dd/MM/yyyy', { locale: es })}
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
                        {formatMoney(cuota.saldoProyectado, selectedPrestamo.moneda)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pago */}
      {showPagoForm && selectedPrestamo && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">
                Realizar Pago - Préstamo #{selectedPrestamo.id}
              </h3>
              <button
                onClick={() => setShowPagoForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>

            <form onSubmit={handlePagoSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cuenta a Debitar
                </label>
                <select
                  value={pagoData.cuentaId}
                  onChange={(e) => setPagoData({ ...pagoData, cuentaId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Seleccione una cuenta</option>
                  {cuentasCliente.map((cuenta) => {
                    const saldoEnMonedaPrestamo = handleMontoConversion(
                      cuenta.saldo,
                      cuenta.moneda,
                      selectedPrestamo.moneda
                    );
                    return (
                      <option key={cuenta.id} value={cuenta.id}>
                        {cuenta.descripcion} - Saldo: {formatMoney(cuenta.saldo, cuenta.moneda)} 
                        ({formatMoney(saldoEnMonedaPrestamo, selectedPrestamo.moneda)} en moneda del préstamo)
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Monto del Pago ({selectedPrestamo.moneda})
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {getMonedaSymbol(selectedPrestamo.moneda as TipoMoneda)}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={pagoData.monto}
                    onChange={(e) => setPagoData({ ...pagoData, monto: e.target.value })}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0.00"
                    required
                  />
                </div>
                {pagoData.cuentaId && pagoData.monto && (
                  <p className="mt-1 text-sm text-gray-500">
                    {(() => {
                      const cuenta = cuentasCliente.find(c => c.id === parseInt(pagoData.cuentaId));
                      if (cuenta) {
                        const montoEnMonedaCuenta = handleMontoConversion(
                          parseFloat(pagoData.monto),
                          selectedPrestamo.moneda,
                          cuenta.moneda
                        );
                        return `Se debitarán ${formatMoney(montoEnMonedaCuenta, cuenta.moneda)} de su cuenta`;
                      }
                      return '';
                    })()}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="esPagoExtraordinario"
                  type="checkbox"
                  checked={pagoData.esPagoExtraordinario}
                  onChange={(e) => setPagoData({ ...pagoData, esPagoExtraordinario: e.target.checked })}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="esPagoExtraordinario" className="ml-2 block text-sm text-gray-900">
                  Es pago extraordinario
                </label>
              </div>

              {error && (
                <div className="text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
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
                  Realizar Pago
                </button>
              </div>
            </form>
          </div>
      </div>
      )}
    </div>
  );
};

export default Prestamos; 
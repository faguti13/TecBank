import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useAuth } from '../contexts/AuthContext';
import { prestamoService, Prestamo, CalendarioPago, PagoPrestamo } from '../services/prestamoService';

const Prestamos: React.FC = () => {
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [selectedPrestamo, setSelectedPrestamo] = useState<Prestamo | null>(null);
  const [showPagoForm, setShowPagoForm] = useState(false);
  const [showCalendario, setShowCalendario] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pagoData, setPagoData] = useState({
    monto: '',
    esPagoExtraordinario: false
  });

  const { user } = useAuth();

  useEffect(() => {
    console.log('Prestamos component mounted');
    console.log('Current user:', user);
    
    if (user?.cedula) {
      console.log('User cédula found, loading préstamos...');
      loadPrestamos();
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

  const handlePagoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPrestamo) return;

    try {
      const pago: PagoPrestamo = {
        monto: parseFloat(pagoData.monto),
        fechaPago: new Date(),
        esPagoExtraordinario: pagoData.esPagoExtraordinario
      };

      await prestamoService.registrarPago(selectedPrestamo.id, pago);
      setShowPagoForm(false);
      setPagoData({ monto: '', esPagoExtraordinario: false });
      loadPrestamos();
    } catch (err) {
      setError('No se pudo registrar el pago. Por favor, verifique los datos e intente nuevamente.');
    }
  };

  const formatMoney = (amount: number, moneda: string) => {
    const currency = moneda === 'Colones' ? 'CRC' : 
                    moneda === 'Dolares' ? 'USD' : 'EUR';
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: currency
    }).format(amount);
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          cuota.pagado
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cuota.pagado ? 'Pagado' : 'Pendiente'}
                        </span>
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
                  Monto del Pago
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {selectedPrestamo.moneda === 'Colones' ? '₡' : '$'}
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
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">
                      {selectedPrestamo.moneda}
                    </span>
                  </div>
                </div>
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

              <div className="flex justify-end space-x-3 mt-6">
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
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Cuenta, buscarCuentaPorNumero } from '../services/cuentaService';
import { Compra, Tarjeta, tarjetaService } from '../services/tarjetaService';
import {EyeIcon, CurrencyDollarIcon, FunnelIcon} from '@heroicons/react/24/outline';

const Tarjetas: React.FC = () => {

  const { user } = useAuth();
  const [cuentasCliente, setCuentasCliente] = useState<Cuenta[]>([]); // estado para guardar las cuentas
  const [tarjetasCliente, setTarjetasCliente] = useState<Tarjeta[]>([]);
  const [selectedTarjeta, setSelectedTarjeta] = useState<Tarjeta | null>(null);
  const [compras, setCompras] = useState<Compra[]>([]); // Aquí se almacenan las compras
  const [showPagoForm, setShowPagoForm] = useState(false); // visualización del modal de form pagos
  const [showCompraPorNumForm, setShowCompraPorNumForm] = useState(false); // visualización del modal de form compras
  
  const [loading, setLoading] = useState(false); 
  const [montoP, setMontoP] = useState('');
  const [fechaP, setFechaP] = useState('');

  const [startDate, setStartDate] = useState<string>('');  // Fecha inicio
  const [endDate, setEndDate] = useState<string>('');      // Fecha fin
  const [showFilterForm, setShowFilterForm] = useState(false); // Mostrar formulario de filtro

  const resetFormPagos = () => { // Resetear el forms de registrar una nueva compra
    setMontoP('');
    setFechaP('');
  };

  const resetFormFiltrar = () => {
    setStartDate('');
    setEndDate('');
  };  

/////////////////////////// Función para obtener el símbolo de la moneda según el tipo
  const getCurrencySymbol = (moneda: string) => {
    switch (moneda) {
      case 'USD':
        return '$'; // Dólar
      case 'CRC':
        return '₡'; // Colón costarricense
      case 'EUR':
        return '€'; // Euro
      default:
        return ''; 
    }
  };
/////////////////////////// llamado automatico para obtener cuentas asociadas
  type TarjetaConMoneda = Tarjeta & { simboloMoneda: string };

  const handleBuscarCuentas = async () => {
    try {
      if (!user?.cedula) {
        alert('No se encontró la cédula del usuario');
        return;
      }

      const cuentas = await tarjetaService.buscarCuentaPorCedula(user.cedula);

      console.log('Cuentas encontradas:', cuentas);

      if (cuentas.length === 0) {
        //alert('No se encontraron cuentas asociadas a esta cédula.');
        return;
      }

      setCuentasCliente(cuentas);

      // Obtener las tarjetas asociadas a cada cuenta
      const tarjetasPromises = cuentas.map((cuenta) =>
        tarjetaService.getByNumeroCuenta(cuenta.numeroCuenta)
      );

      const resultados: PromiseSettledResult<Tarjeta>[] = await Promise.allSettled(tarjetasPromises);

      // Filtra solo los resultados que fueron exitosos
      const tarjetas = resultados
        .filter((resultado) => resultado.status === 'fulfilled')
        .map((resultado) => resultado.value);
      //console.log('Tarjetas filtradas (exitosas):', tarjetas);

      const tarjetasConMoneda: TarjetaConMoneda[] = tarjetas.map((tarjeta) => {
      
        const cuenta = cuentas.find((cuenta) => cuenta.numeroCuenta === tarjeta.numeroCuenta);
        if (!cuenta) return null; //omite las cuentas sin tarjeta

        const simboloMoneda = getCurrencySymbol(cuenta.moneda);
        //console.log(`Tarjeta Número de Cuenta: ${tarjeta.numeroCuenta}, Cuenta Moneda: ${cuenta.moneda}, Símbolo de la Moneda: ${simboloMoneda}`);
        return {
          ...tarjeta,
          simboloMoneda, 
        };
      }).filter((tarjeta): tarjeta is TarjetaConMoneda => tarjeta !== null); 

      setTarjetasCliente(tarjetasConMoneda as TarjetaConMoneda[]);
      
    } catch (error) {
      console.error('Error al obtener tarjetas asociadas:', error);
      //alert('Hubo un error al buscar las tarjetas asociadas.');
    }
  };

  useEffect(() => {
    if (user) {
      handleBuscarCuentas();
    }
  }, [user]);

/////////////////////// manejador del envio del formulario de nuevo pagp
  const handleSubmitPago = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTarjeta) return;
    const nuevoPago = {
      numeroTarjeta: selectedTarjeta.numeroTarjeta!,
      montoP,
      fechaP,
    };

    // Validación del monto a abonar
    const montoNumerico = parseFloat(montoP); 
    if (selectedTarjeta.tipoTarjeta === 'Debito') {
      alert('Una tarjeta de débito no tiene montos pendientes.');
      return;
    } else if (selectedTarjeta.tipoTarjeta === 'Credito') {
      if (selectedTarjeta.montoSinCancelar !== undefined && montoNumerico > selectedTarjeta.montoSinCancelar) {
        alert('El monto del pago excede el saldo pendiente.');
        return;
      }
    }

    try {

      await tarjetaService.registrarPago(nuevoPago);
    
      alert('Pago creado con éxito');
      handleActSaldo(e);
      
    } catch (error) {
      alert('Error al crear el pago :(');
    }
  };

/////////////////////// manejador del envio del formulario para actualizar montos
  const handleActSaldo = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTarjeta) return;
    //const montoNumerico = parseFloat(monto); 

    try {
      const nuevoMonto = parseFloat(montoP);   // El monto a restar
      await tarjetaService.actualizarSaldo(selectedTarjeta.numeroTarjeta!, nuevoMonto);
      alert('Saldo actualizado con éxito');
      handleBuscarCuentas();
      resetFormPagos();
      setShowPagoForm(false);
      
    } catch (error) {
      //console.error('Error al crear la tarjeta', error);
      alert('Error al actualizar la tarjeta');
    }
  };

  /////////////////////// Llamada al API para obtener todas las compras de una tarejta especifica
  const fetchCompras = async (numeroTarjeta: string) => {
    setLoading(true);
    try {
      const compras = await tarjetaService.compraGetByNumTarjeta(numeroTarjeta);

      setCompras(compras);
    } catch (error) {
      console.error('Error al obtener las compras:', error);
      //alert('Hubo un problema al obtener las compras. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowCompraPorNumForm(false)
    setSelectedTarjeta(null);
    setCompras([]); // Limpia compras al cerrar el modal
  };

  // Función para ver las compras de la tarjeta seleccionada
  const handleVerCompras = (tarjeta: Tarjeta) => {
    setSelectedTarjeta(tarjeta);
    fetchCompras(tarjeta.numeroTarjeta); 
    setShowCompraPorNumForm(true); 
  };

  /////////////////////// filtrar compras por fecha
  const filterComprasByDate = (compras: Compra[], start: string, end: string): Compra[] => {
    if (!start || !end) return compras;
  
    const startDate = new Date(start);
    const endDate = new Date(end);
  
    return compras.filter(compra => {
      const compraDate = new Date(compra.fecha);
      return compraDate >= startDate && compraDate <= endDate;
    });
  };
  
  const handleFilterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!selectedTarjeta) {
      alert("No se ha seleccionado una tarjeta.");
      return;
    }

    const allCompras = await tarjetaService.compraGetByNumTarjeta(selectedTarjeta.numeroTarjeta);
    const filteredCompras = filterComprasByDate(allCompras, startDate, endDate);
  
    setCompras(filteredCompras);
    setShowFilterForm(false);
    setShowCompraPorNumForm(true);
  };
  
  /////////////////////////////////
 
return (
  <>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tarjetas</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
      <p className="text-gray-600">
      {cuentasCliente.length === 0
        ? "No hay cuentas registradas para este usuario."
        : "Consulte en esta sección las tarjetas vinculadas a sus cuentas bancarias."}
    </p>
      </div>
    </div>

    
      {tarjetasCliente.length > 0 && (
      <div className="mt-6 px-6 py-6 bg-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Tarjetas asociadas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm text-gray-700 border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-700">
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Número de Tarjeta</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Fecha Expiración</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Saldo disponible</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Monto Crédito</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Monto Pendiente</th>
                <th className="px-6 py-3 text-left font-medium uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tarjetasCliente.map((tarjeta, index) => (
                <tr key={tarjeta.numeroTarjeta} className="hover:bg-gray-50 transition-colors duration-300">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4">{tarjeta.numeroTarjeta}</td>
                  <td className="px-6 py-4">{tarjeta.tipoTarjeta}</td>
                  <td className="px-6 py-4">{tarjeta.fechaExpiracion}</td>
                  <td className="px-6 py-4">{(tarjeta as TarjetaConMoneda).simboloMoneda} {tarjeta.saldoDisponible ?? '-'}</td>
                  <td className="px-6 py-4">{(tarjeta as TarjetaConMoneda).simboloMoneda} {tarjeta.montoCredito ?? '-'}</td>
                  <td className="px-6 py-4">{(tarjeta as TarjetaConMoneda).simboloMoneda} {tarjeta.montoSinCancelar ?? '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2 justify-center">
                      <button
                        onClick={() => {
                          setSelectedTarjeta(tarjeta);
                          handleVerCompras(tarjeta);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-md transition-all duration-200"
                        title="Ver compras realizadas"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTarjeta(tarjeta);
                          setShowFilterForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-md transition-all duration-200"
                        title="Filtrar compras realizadas por fecha"
                      >
                        <FunnelIcon className="h-5 w-5" />
                      </button>

                      <button
                        onClick={() => {
                          if (tarjeta.tipoTarjeta === "Debito") {
                            alert("Las tarjetas de débito no tienen saldo pendiente para abonar.");
                            return;
                          }
                          setSelectedTarjeta(tarjeta);
                          setShowPagoForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-800 p-2 rounded-md transition-all duration-200"
                        title="Agregar Pago al saldo pendiente"
                      >
                        <CurrencyDollarIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}



    {/* Modal de agregar un pago*/}
    {showPagoForm && selectedTarjeta &&(
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Agregar nuevo pago</h2>
            <form onSubmit={handleSubmitPago}>
              <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Monto de pago</label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  {(selectedTarjeta as TarjetaConMoneda).simboloMoneda}
                </span>
                <input
                  type="number"
                  value={montoP}
                  onChange={(e) => setMontoP(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full pl-8" 
                  required
                />
              </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de realización</label>
                <input
                  type="date"
                  value={fechaP}
                  onChange={(e) => setFechaP(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {setShowPagoForm(false);
                    resetFormPagos()}}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
     

      {/* Modal para mostrar las compras de cada tarjeta */}
      {showCompraPorNumForm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-fade-in">
            <h2 className="text-xl font-bold text-indigo-700 text-center mb-2">
              Compras realizadas
            </h2>
            <p className="text-center text-sm text-gray-500 mb-4">
              Tarjeta: <span className="font-semibold text-gray-800">{selectedTarjeta?.numeroTarjeta}</span>
            </p>

            {loading ? (
              <p className="text-center text-gray-400 italic">Cargando compras...</p>
            ) : compras.length > 0 ? (
              <ul className="divide-y divide-gray-100 max-h-72 overflow-y-auto pr-1">
                {compras.map((compra, index) => (
                  <li key={index} className="py-2 px-2 hover:bg-gray-50 rounded-md transition text-sm">
                    <div className="flex justify-between items-center mb-0.5">
                      <span className="font-medium text-gray-800">
                        Compra #{index + 1}
                      </span>
                      <span className="text-green-600 font-semibold">
                        Total: {(selectedTarjeta as TarjetaConMoneda).simboloMoneda} {Number(compra.monto).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      Fecha: {compra.fecha}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-400 italic">No se encontraron compras.</p>
            )}

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  handleCloseModal();
                  resetFormFiltrar();
                }}
                className="bg-indigo-600 hover:bg-red-600 transition-colors text-white font-semibold px-5 py-2 rounded-md shadow-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de filtro */}
      {showFilterForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Filtrar búsqueda de compras</h2>
            <form onSubmit={handleFilterSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de inicio</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha final</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowFilterForm(false);
                    resetFormFiltrar();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Filtrar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

  </>
);

};

export default Tarjetas; 
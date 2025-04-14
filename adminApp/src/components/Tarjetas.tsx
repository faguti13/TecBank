import React, { useEffect, useState } from 'react';
import {DocumentPlusIcon, EyeIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

import { Compra, Tarjeta, tarjetaService } from '../services/tarjetaService'; 
import { Cuenta } from '../services/cuentaService'; 

const Tarjetas: React.FC = () => {
  // Estado para mostrar el formulario modal
  const [showForm, setShowForm] = useState(false);

  const [tipoTarjeta, setTipoTarjeta] = useState<string>(''); // Estado para el tipo de tarjeta
  const [saldoDisponible, setSaldoDisponible] = useState<string>(''); // Saldo disponible
  const [montoCredito, setMontoCredito] = useState<string>(''); // Monto de crédito

  //const [idCliente, setIdCliente] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [codigoSeguridad, setCodigoSeguridad] = useState('');

  const [isCuentaConfirmada, setIsCuentaConfirmada] = useState(false);
  const [isCuentaExistente, setIsCuentaExistente] = useState(false);
  const [tarjetas, setTarjetas] = useState<Tarjeta[]>([]);
  const [selectedTarjeta, setSelectedTarjeta] = useState<Tarjeta | null>(null);

  const [compras, setCompras] = useState<Compra[]>([]); // Aquí se almacenan las compras
  const [showCompraForm, setShowCompraForm] = useState(false); // visualización del modal de form compras
  const [showPagoForm, setShowPagoForm] = useState(false); // visualización del modal de form pagos
  const [showCompraPorNumForm, setShowCompraPorNumForm] = useState(false); // visualización del modal de las compras por tarjetas
  const [loading, setLoading] = useState(false); //

  const [monto, setMonto] = useState('');
  const [fecha, setFecha] = useState('');

  const [montoP, setMontoP] = useState('');
  const [fechaP, setFechaP] = useState('');

  const resetForm = () => { // Resetear la confirmación de cuenta, todo en blanco
    setNumeroCuenta('');
    setNumeroTarjeta('');
    setTipoTarjeta('');
    setSaldoDisponible('');
    setMontoCredito('');
    setFechaExpiracion('');
    setCodigoSeguridad('');
    setIsCuentaConfirmada(false); 
  };

  const resetFormCompras = () => { // Resetear el forms de registrar una nueva compra
    setMonto('');
    setFecha('');
  };

  const resetFormPagos = () => { // Resetear el forms de registrar una nueva compra
    setMontoP('');
    setFechaP('');
  };

  const getCurrencySymbol = (moneda: string): string => {
    switch (moneda) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'CRC':
        return '₡';
      default:
        return '$'; // Símbolo por defecto
    }
  };
  

  /////////////////////// manejador del envio del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevaTarjeta = {
      //idCliente: parseInt(idCliente),
      numeroCuenta,
      numeroTarjeta,
      tipoTarjeta: tipoTarjeta as 'Debito' | 'Credito',
      saldoDisponible: tipoTarjeta === 'Debito' ? parseFloat(saldoDisponible) : undefined,
      montoCredito: tipoTarjeta === 'Credito' ? parseFloat(montoCredito) : undefined,
      fechaExpiracion:fechaExpiracion,
      codigoSeguridad,
      montoSinCancelar:0,
    };

    try {
      await tarjetaService.create(nuevaTarjeta);

      alert('Tarjeta creada con éxito');
      fetchTarjetas();
      resetForm(); //limpiar el formulario con la tarjeta ya creada
      setShowForm(false); // cerrar modal
      
    } catch (error) {
      //console.error('Error al crear la tarjeta', error);
      alert('Error al crear la tarjeta');
    }
  };


  /////////////////////// Llamada al API para obtener todas las compras de una tarejta especifica
  const deleteTarjera = async (tarjeta: Tarjeta) => {
    setLoading(true);

    if(tarjeta.montoSinCancelar != 0){
      alert('Esta tarjeta no se puede eliminar: aún tiene un saldo pendiente por cancelar.');
      return 
    }

    try {
      await tarjetaService.deleteTarjeta(tarjeta.numeroTarjeta);
      alert('Tarjeta elimanda con éxito');
      fetchTarjetas();

    } catch (error) {
      console.error('Error al obtener las compras:', error);
      //alert('Hubo un problema al obtener las compras. Intente nuevamente.');
    } 
  };

/////////////////////// manejador de verificacion de que el num cuenta no esta asociado a otra cuenta
  const handleConfirmarUnicidadCuenta = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const tarjeta = await tarjetaService.verificarUnicidadCuenta(numeroCuenta);
      alert('El número de cuenta digitado ya está asociado a una tarjeta existente'); // Si se recibe una tarjeta, significa que está asociada
      resetForm();

    } catch (error) {
      if (error instanceof Error) { // Aquí, si se recibe un error, significa que no se encontró la tarjeta asociada
        if (error.message === 'El número de cuenta no está asociado a una cuenta') {
          setIsCuentaConfirmada(true);
        } else {
          alert('Hubo un problema al verificar la cuenta, vuelva a intentarlo');
          resetForm();
        }
      } else {
        console.error('Error inesperado', error);
        alert('Hubo un error inesperado');
      }
    }
  };


 /////////////////////// manejador del la existencia del numero de cuentas en cuentas.json 
  const handleConfirmarCuenta = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      await tarjetaService.verificarCuenta(numeroCuenta);
      setIsCuentaExistente(true);  

      if (isCuentaExistente) {
        await handleConfirmarUnicidadCuenta(e);  // Llama a la función para verificar unicidad
      }

    } catch (error) {
      if (error instanceof Error) {

        if (error.message === 'El número de cuenta no existe') {
          alert('El número de cuenta digitado no existe, por favor digite un número de cuenta ya registrado');
          resetForm()

        } else {
          alert('Hubo un problema al verificar la cuenta, vuelva a intentarlo');
          resetForm()
        }
      } else {
        console.error('Error inesperado', error);
        alert('Hubo un error inesperado');
      }
    }
  };

/////////////////////// Llamada al API para obtener todas las tarjetas
type TarjetaConMoneda = Tarjeta & {simboloMoneda: string;};

  useEffect(() => {
    fetchTarjetas()
  }, []);

  const fetchTarjetas = async () => {
    try {
      const tarjetas = await tarjetaService.getAll();
      const tarjetasConMoneda: TarjetaConMoneda[] = [];


      for (const tarjeta of tarjetas) {
        try {
          const cuenta = await tarjetaService.obtenerCuenta(tarjeta.numeroCuenta);
          const simboloMoneda = cuenta.moneda;  
  
          console.log(`Número de cuenta: ${cuenta.numeroCuenta}, Cuenta.moneda: ${cuenta.moneda}, Símbolo de moneda: ${getCurrencySymbol(simboloMoneda)}`);

          tarjetasConMoneda.push({
            ...tarjeta,
            simboloMoneda: getCurrencySymbol(simboloMoneda),  
          });
        } catch (error) {
          console.error('Error al obtener la cuenta asociada para la tarjeta', tarjeta.numeroCuenta, error);
          tarjetasConMoneda.push({
            ...tarjeta,
            simboloMoneda: '$', // Valor por defecto
          });
        }
      }
  
      setTarjetas(tarjetasConMoneda); //  tarjetas con moneda
    } catch (error) {
      console.error('Error al obtener las tarjetas:', error);
      alert('Hubo un problema al obtener las tarjetas');
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
    //fetchTarjetas();
    
  } catch (error) {
    //console.error('Error al crear la tarjeta', error);
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
    fetchTarjetas();
    resetFormPagos();
    setShowPagoForm(false);
    
  } catch (error) {
    //console.error('Error al crear la tarjeta', error);
    alert('Error al actualizar la tarjeta');
  }
};

/////////////////////// manejador del envio del formulario de nueva compra
  const handleSubmitCompra = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedTarjeta) return;
    const nuevaCompra = {
      monto,
      fecha,
      numeroTarjeta: selectedTarjeta.numeroTarjeta!,
    };

    // Validación del monto según el tipo de tarjeta
    const montoNumerico = parseFloat(monto); 
    if (selectedTarjeta.tipoTarjeta === 'Debito') {
      if (selectedTarjeta.saldoDisponible !== undefined && montoNumerico > selectedTarjeta.saldoDisponible) {
        alert('El monto de la compra excede el saldo disponible de la tarjeta de débito. No se puede realizar la compra.');
        return;
      }
    } else if (selectedTarjeta.tipoTarjeta === 'Credito') {
      if (selectedTarjeta.montoCredito !== undefined && montoNumerico > selectedTarjeta.montoCredito) {
        alert('El monto de la compra excede el crédito disponible en la tarjeta. No se puede realizar la compra');
        return;
      }
    }

    try {

      await tarjetaService.registrarCompra(nuevaCompra);
      //const nuevoMonto = montoNumerico;  // El monto a restar
      //await tarjetaService.actualizarMonto(selectedTarjeta.numeroTarjeta!, nuevoMonto);

      //setShowCompraForm(false);
      //resetFormCompras();
      alert('Compra creada con éxito');
      handleActMontos(e);
      //fetchTarjetas();
      
    } catch (error) {
      //console.error('Error al crear la tarjeta', error);
      alert('Error al crear la compra :(');
    }
  };

/////////////////////// manejador del envio del formulario para actualizar montos
const handleActMontos = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!selectedTarjeta) return;
  //const montoNumerico = parseFloat(monto); 

  try {
    const nuevoMonto = parseFloat(monto);   // El monto a restar
    await tarjetaService.actualizarMonto(selectedTarjeta.numeroTarjeta!, nuevoMonto);
    alert('Montos actualizados con éxito');
    fetchTarjetas();
    resetFormCompras();
    setShowCompraForm(false);
    
  } catch (error) {
    //console.error('Error al crear la tarjeta', error);
    alert('Error al actualizar la tarjeta');
  }
};

 ///////////////////////  lo que se muestra
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Gestión de Tarjetas</h2>
      
      {/* Botón para abrir el modal */}
      <div className="mb-4">
        <button
          onClick={() => setShowForm(true)} // Mostrar el formulario cuando se hace clic
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Agregar Tarjeta
        </button>
      </div>

      {/* Pestaña que aparece cuando showForm es true (cuando se presiona agregar tarjeta) */}
      
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-lg font-medium mb-4">Nuevo Tarjeta</h3>
            <form className="space-y-4" onSubmit={handleSubmit}>

              {/* campo ID cliente */}
              {/*<div>
                <label className="block text-sm font-medium text-gray-700">
                  ID del cliente
                </label>
                <input
                  type="number"
                  value={idCliente}
                  onChange={(e) => setIdCliente(e.target.value)}
                  
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>*/}

              {/* campo Número de cuenta */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                    Número de cuenta a la que se asociará la tarjeta
                </label>
                <input
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => setNumeroCuenta(e.target.value)}
                    
                    //maxLength={16} // Para un formato (XXXX XXXX XXXX XXXX)
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    disabled={isCuentaConfirmada} //para no modificarla una vez creada
                    required
                />
              </div>

              {/* Botón para confirmar cuenta */}
              <div>
                <button
                  type="button"
                  onClick={handleConfirmarCuenta}
                  disabled={isCuentaConfirmada}
                  className={`px-4 py-2 text-sm font-medium ${isCuentaConfirmada ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white rounded-md`}
                >
                  Confirmar cuenta
                </button>
              </div>
              
              {/* Si la cuenta está confirmada, mostramos el resto de los campos */}
              {isCuentaConfirmada && (
              <>
              {/* campo Número de tarjeta */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                    Número de tarjeta
                </label>
                <input
                    type="text"
                    value={numeroTarjeta}
                    onChange={(e) => setNumeroTarjeta(e.target.value)}
                    
                    maxLength={16} // Para un formato (XXXX XXXX XXXX XXXX)
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
              </div>

              {/* campo Tipo de tarjeta */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo de tarjeta</label>
                <select
                  value={tipoTarjeta}
                  onChange={(e) => setTipoTarjeta(e.target.value)}
                  
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Selecciona el tipo de tarjeta</option>
                  <option value="Debito">Débito</option>
                  <option value="Credito">Crédito</option>
                </select>
              </div>

              {/* Campo para saldo o monto según tipo de tarjeta */}
              {tipoTarjeta === 'Debito' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Saldo disponible</label>
                  <input
                    type="number"
                    value={saldoDisponible}
                    onChange={(e) => setSaldoDisponible(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {tipoTarjeta === 'Credito' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Monto de crédito</label>
                  <input
                    type="number"
                    value={montoCredito}
                    onChange={(e) => setMontoCredito(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              )}

              {/* campo Fecha de expiración */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                    Fecha de expiración
                </label>
                <input
                    type="month"
                    value={fechaExpiracion}
                    onChange={(e) => setFechaExpiracion(e.target.value)}
                    min={`${new Date().getFullYear()}-01`} 
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
              </div>

              {/* campo Código de seguridad */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                    Código de seguridad
                </label>
                <input
                    type="text"
                    value={codigoSeguridad}
                    onChange={(e) => setCodigoSeguridad(e.target.value)}
                    maxLength={3} // Para un formato (CVV)
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
              </div>
              </>
              )}

              {/* Botones para cancelar o confirmar */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm(); // limpiar los campos
                    setShowForm(false); // Cerrar el formulario
                  }}
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
      )}


      {/* Mostrar la tabla de tarjetas abajo del formulario */}
      <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Listado de Tarjetas</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Cuenta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Número de Tarjeta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo de Tarjeta</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Disponible</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Monto Crédito</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Expiración</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Saldo Pendiente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {tarjetas.map((tarjeta) => (
                    <tr key={tarjeta.numeroTarjeta}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tarjeta.numeroCuenta}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tarjeta.numeroTarjeta}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tarjeta.tipoTarjeta}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(tarjeta as TarjetaConMoneda).simboloMoneda} {tarjeta.saldoDisponible ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(tarjeta as TarjetaConMoneda).simboloMoneda} {tarjeta.montoCredito ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {tarjeta.fechaExpiracion}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(tarjeta as TarjetaConMoneda).simboloMoneda} {tarjeta.tipoTarjeta === "Credito" ? tarjeta.montoSinCancelar : "N/A"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                              onClick={() => {
                                setSelectedTarjeta(tarjeta);
                                setShowCompraForm(true);
                              }}
                            title="Agregar nueva compra"
                            className="text-indigo-600 hover:text-indigo-900 mr-2">
                          < DocumentPlusIcon className="h-4 w-4" />
                          </button>

                          <button
                              onClick={() => { 
                                setSelectedTarjeta(tarjeta); handleVerCompras(tarjeta);
                                }} 
                            title="Ver compras realizadas"
                            className="text-indigo-600 hover:text-indigo-900 mr-2">
                          < EyeIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => {deleteTarjera(tarjeta)}}
                            title="Eliminar tarjeta"
                            className="text-red-600 hover:text-red-900 mr-1">
                          <TrashIcon className="h-4 w-4" />
                          </button>

                          <button
                            onClick={() => { if (tarjeta.tipoTarjeta === "Debito") {
                              alert("Las tarjetas de débito no tienen saldo pendiente para abonar.");
                              return;
                            }
                        
                              setSelectedTarjeta(tarjeta);
                              setShowPagoForm(true)}}
                            title="Agregar Pago al saldo pendiente"
                            className="text-indigo-600 hover:text-indigo-900 mr-2">
                          <PlusIcon className="h-4 w-4" />
                          </button>
                      </td>
                 
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

      {/* Modal de agregar una compra*/}
      {showCompraForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Agregar nueva compra</h2>
            <form onSubmit={handleSubmitCompra}>
             
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Monto de pago</label>

                <div className="relative mt-1">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    {(selectedTarjeta as TarjetaConMoneda).simboloMoneda}
                  </span>

                  <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full pl-8"  // Añadir padding a la izquierda para que el texto no se superponga al símbolo
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Fecha de realización</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {setShowCompraForm(false);
                    resetFormCompras()}}
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

      {/* Modal de agregar un pago*/}
      {showPagoForm && (
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

      {/* Modal para mostrar las compras de cada tarjeta*/}
      {showCompraPorNumForm && (
              <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                  <h2 className="text-xl font-medium mb-4">Compras realizadas para {selectedTarjeta?.numeroTarjeta}</h2>

                  {loading ? (
                    <p>Cargando...</p>
                  ) : compras.length > 0 ? (
                    <ul>
                      {compras.map((compra, index) => (
                        <li key={index} className="mb-2">
                          <p>Monto de compra #{index + 1}: {(selectedTarjeta as TarjetaConMoneda).simboloMoneda}{compra.monto}</p>
                          <p>Fecha: {compra.fecha}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No se encontraron compras.</p>
                  )}

                  <button
                    onClick={handleCloseModal}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg">
                    Cerrar
                  </button>
                </div>
              </div>
            )}
    </div>
  );
}

export default Tarjetas;
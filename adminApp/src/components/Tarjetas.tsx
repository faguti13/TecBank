import React, { useState } from 'react';

import { tarjetaService } from '../services/tarjetaService'; // ajusta la ruta según tu estructura

const Tarjetas: React.FC = () => {
  // Estado para mostrar el formulario modal
  const [showForm, setShowForm] = useState(false);

  const [tipoTarjeta, setTipoTarjeta] = useState<string>(''); // Estado para el tipo de tarjeta
  const [saldoDisponible, setSaldoDisponible] = useState<string>(''); // Saldo disponible
  const [montoCredito, setMontoCredito] = useState<string>(''); // Monto de crédito

  const [idCliente, setIdCliente] = useState('');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [numeroTarjeta, setNumeroTarjeta] = useState('');
  const [fechaExpiracion, setFechaExpiracion] = useState('');
  const [codigoSeguridad, setCodigoSeguridad] = useState('');

  // manejador del envio del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nuevaTarjeta = {
      //idCliente: parseInt(idCliente),
      numeroCuenta,
      numeroTarjeta,
      tipoTarjeta: tipoTarjeta as 'debito' | 'credito',
      saldoDisponible: tipoTarjeta === 'debito' ? parseFloat(saldoDisponible) : undefined,
      montoCredito: tipoTarjeta === 'credito' ? parseFloat(montoCredito) : undefined,
      fechaExpiracion:fechaExpiracion,
      codigoSeguridad,
    };

    try {
      await tarjetaService.create(nuevaTarjeta);

      alert('Tarjeta creada con éxito');
      setShowForm(false); // cerrar modal
      
    } catch (error) {
      //console.error('Error al crear la tarjeta', error);
      alert('Error al crear la tarjeta');
    }
  };

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
            <h3 className="text-lg font-medium mb-4">Nuevo Préstamo</h3>
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
                    Número de cuenta
                </label>
                <input
                    type="text"
                    value={numeroCuenta}
                    onChange={(e) => setNumeroCuenta(e.target.value)}
                    
                    maxLength={16} // Para un formato (XXXX XXXX XXXX XXXX)
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                />
              </div>

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
                  <option value="debito">Débito</option>
                  <option value="credito">Crédito</option>
                </select>
              </div>

              {/* Campo para saldo o monto según tipo de tarjeta */}
              {tipoTarjeta === 'debito' && (
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

              {tipoTarjeta === 'credito' && (
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

              {/* Botones para cancelar o confirmar */}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)} // Cerrar el formulario
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
    </div>
  );
};

export default Tarjetas;

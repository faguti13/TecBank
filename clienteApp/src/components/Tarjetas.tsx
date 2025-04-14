import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Cuenta, buscarCuentaPorNumero } from '../services/cuentaService';
import { Tarjeta, tarjetaService } from '../services/tarjetaService';
import {EyeIcon, PlusIcon} from '@heroicons/react/24/outline';

const Tarjetas: React.FC = () => {

  const { user } = useAuth();
  const [cuentasCliente, setCuentasCliente] = useState<Cuenta[]>([]); // estado para guardar las cuentas
  const [tarjetasCliente, setTarjetasCliente] = useState<Tarjeta[]>([]);


/////////////////////////// llamado automatico para obtener cuentas asociadas
  const handleBuscarCuentas= async () => {
    try {
      if (!user?.cedula) {
        alert('No se encontró la cédula del usuario');
        return;
      }
  
      const cuentas = await tarjetaService.buscarCuentaPorCedula(user.cedula);
  
      if (cuentas.length === 0) {
        alert('No se encontraron cuentas asociadas a esta cédula.');
        return;
      }
  
      // Guarda las cuentas
      setCuentasCliente(cuentas);
  
      //  las tarjetas asociadas a cada cuenta
      const tarjetasPromises = cuentas.map((cuenta) =>
        tarjetaService.getByNumeroCuenta(cuenta.numeroCuenta)
      );
  
      const tarjetas = await Promise.all(tarjetasPromises);
  
      console.log('Tarjetas asociadas:', tarjetas);
      //alert(`Se encontraron ${tarjetas.length} tarjetas asociadas.`);
  
      setTarjetasCliente(tarjetas);  
  
    } catch (error) {
      console.error('Error al obtener tarjetas asociadas:', error);
      alert('Hubo un error al buscar las tarjetas asociadas.');
    }
  };
  

  useEffect(() => {
    if (user) {
      handleBuscarCuentas();
    }
  }, [user]);

/////////////////////////// obtener las tarjetas relacionadas a cada cuenta
  
return (
  <>
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tarjetas</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Consulte en esta sección las tarjetas vinculadas a sus cuentas bancarias.</p>
      </div>
    </div>

    
    {tarjetasCliente.length > 0 && (
      <div className="mt-6 px-6">
        <h2 className="text-lg font-semibold mb-2">Tarjetas asociadas</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">#</th>
                <th className="px-4 py-2 border">Número de Tarjeta</th>
                <th className="px-4 py-2 border">Tipo</th>
                <th className="px-4 py-2 border">Fecha Expiración</th>
                <th className="px-4 py-2 border">Saldo disponible</th>
                <th className="px-4 py-2 border">Monto Crédito</th>
                <th className="px-4 py-2 border">Monto Pendiente</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tarjetasCliente.map((tarjeta, index) => (
                <tr key={tarjeta.numeroTarjeta}>
                  <td className="px-4 py-2 border text-center">{index + 1}</td>
                  <td className="px-4 py-2 border text-center">{tarjeta.numeroTarjeta}</td>
                  <td className="px-4 py-2 border text-center">{tarjeta.tipoTarjeta}</td>
                  <td className="px-4 py-2 border text-center">{tarjeta.fechaExpiracion}</td>
                  <td className="px-4 py-2 border text-center">{tarjeta.saldoDisponible ?? '-'}</td>
                  <td className="px-4 py-2 border text-center">{tarjeta.montoCredito ?? '-'}</td>
                  <td className="px-4 py-2 border text-center">{tarjeta.montoSinCancelar ?? '-'}</td>
                  <td className="px-4 py-2 border text-center">

                          <button
                               
                            title="Ver compras realizadas"
                            className="text-indigo-600 hover:text-indigo-900 mr-2">
                          < EyeIcon className="h-4 w-4" />
                          </button>

                          <button
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
      </div>
    )}

  </>
);

};

export default Tarjetas; 
import React, { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../contexts/AuthContext';

interface Cuenta {
  id: number;
  numeroCuenta: string;
  descripcion: string;
  moneda: string;
  tipoCuenta: string;
  cedulaCliente: string;
  saldo: number;
}

const MisCuentas: React.FC = () => {
  const [cuentas, setCuentas] = useState<Cuenta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchCuentas = async () => {
      if (!user?.cedula) {
        console.error('No hay cédula de usuario disponible');
        setError('No se puede cargar las cuentas sin identificación de usuario');
        setLoading(false);
        return;
      }

      console.log('Intentando obtener cuentas para cédula:', user.cedula);
      try {
        const url = `${API_BASE_URL}/api/Cuentas/cliente/${user.cedula}`;
        console.log('Haciendo petición a:', url);
        
        const response = await fetch(url);
        console.log('Respuesta recibida:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Error al cargar las cuentas: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        setCuentas(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error completo:', err);
        setError('Error al cargar las cuentas. Por favor, intenta más tarde.');
      } finally {
        setLoading(false);
      }
    };

    fetchCuentas();
  }, [user]);

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
                  {getMonedaSymbol(cuenta.moneda)} {(cuenta.saldo || 0).toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Ver Movimientos
                </button>
                <button className="flex-1 px-4 py-2 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors">
                  Transferir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisCuentas; 
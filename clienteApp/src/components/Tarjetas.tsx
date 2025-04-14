import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Cuenta, buscarCuentaPorNumero } from '../services/cuentaService';

const Tarjetas: React.FC = () => {

  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tarjetas</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-600">Consulte en esta sección las tarjetas vinculadas a sus cuentas bancarias.</p>
      </div>
    </div>
  );
};

export default Tarjetas; 
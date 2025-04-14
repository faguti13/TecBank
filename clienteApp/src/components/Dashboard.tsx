import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Bienvenido, {user ? `${user.nombre} ${user.apellido1}` : ''}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/dashboard/cuentas" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Mis Cuentas</h2>
          <p className="text-gray-600">Consulta tus cuentas y movimientos</p>
        </Link>

        <Link to="/dashboard/tarjetas" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Tarjetas</h2>
          <p className="text-gray-600">Gestiona tus tarjetas de crédito</p>
        </Link>

        <Link to="/dashboard/prestamos" className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h2 className="text-xl font-semibold mb-2">Préstamos</h2>
          <p className="text-gray-600">Consulta y paga tus préstamos</p>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard; 
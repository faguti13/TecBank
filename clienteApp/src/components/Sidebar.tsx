import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, CreditCardIcon, BanknotesIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <div className="text-xl font-bold mb-8">TecBank</div>
      <nav className="space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
            location.pathname === '/dashboard' ? 'bg-gray-700' : ''
          }`}
        >
          <HomeIcon className="h-5 w-5" />
          <span>Inicio</span>
        </Link>

        <Link
          to="/dashboard/cuentas"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
            isActive('/cuentas') ? 'bg-gray-700' : ''
          }`}
        >
          <BanknotesIcon className="h-5 w-5" />
          <span>Mis Cuentas</span>
        </Link>

        <Link
          to="/dashboard/tarjetas"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
            isActive('/tarjetas') ? 'bg-gray-700' : ''
          }`}
        >
          <CreditCardIcon className="h-5 w-5" />
          <span>Tarjetas</span>
        </Link>

        <Link
          to="/dashboard/prestamos"
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 ${
            isActive('/prestamos') ? 'bg-gray-700' : ''
          }`}
        >
          <DocumentTextIcon className="h-5 w-5" />
          <span>Préstamos</span>
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar; 
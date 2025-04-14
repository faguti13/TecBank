import React from 'react';
import { Link } from 'react-router-dom';
import {
  UsersIcon,
  BanknotesIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const shortcuts = [
  { name: 'Clientes', href: '/clientes', icon: UsersIcon, description: 'Gestión de clientes del banco' },
  { name: 'Cuentas', href: '/cuentas', icon: BanknotesIcon, description: 'Administración de cuentas bancarias' },
  { name: 'Préstamos', href: '/prestamos', icon: ClipboardDocumentListIcon, description: 'Control de préstamos' },
  { name: 'Tarjetas', href: '/tarjetas', icon: CreditCardIcon, description: 'Gestión de tarjetas' },
  { name: 'Asesores', href: '/asesores', icon: UserGroupIcon, description: 'Administración de asesores' },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon, description: 'Reportes y estadísticas' },
  { name: 'Roles', href: '/roles', icon: ShieldCheckIcon, description: 'Control de roles y permisos' }
];

const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {shortcuts.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="relative flex flex-col p-6 overflow-hidden transition-all duration-300 bg-white rounded-lg shadow hover:shadow-lg hover:scale-105"
        >
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <item.icon className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <h3 className="ml-4 text-lg font-medium text-gray-900">{item.name}</h3>
          </div>
          <p className="mt-3 text-sm text-gray-500">{item.description}</p>
        </Link>
      ))}
    </div>
  );
};

export default Dashboard; 
import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon, UsersIcon, CreditCardIcon, CurrencyDollarIcon, UserGroupIcon, KeyIcon, DocumentTextIcon, ChartBarIcon } from '@heroicons/react/24/outline';

interface LayoutProps {
  children: React.ReactNode;
  navigation: {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const Layout: React.FC<LayoutProps> = ({ children, navigation }) => {
  const navigationItems = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Clientes', href: '/clientes', icon: UsersIcon },
    { name: 'Cuentas', href: '/cuentas', icon: ChartBarIcon },
    { name: 'Tarjetas', href: '/tarjetas', icon: CreditCardIcon },
    { name: 'Préstamos', href: '/prestamos', icon: CurrencyDollarIcon },
    { name: 'Asesores', href: '/asesores', icon: UserGroupIcon },
    { name: 'Roles', href: '/roles', icon: KeyIcon },
    { name: 'Reportes', href: '/reportes', icon: DocumentTextIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 bg-blue-600">
            <h1 className="text-xl font-bold text-white">TecBank Admin</h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="flex items-center px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
              >
                <item.icon className="w-6 h-6 mr-3 text-gray-400 group-hover:text-gray-500" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="pl-64">
        <header className="bg-white shadow">
          <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          </div>
        </header>
        <main>
          <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 
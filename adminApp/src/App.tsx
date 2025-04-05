import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, CreditCardIcon, 
         CurrencyDollarIcon, ClipboardDocumentListIcon, 
         ExclamationTriangleIcon, ChartBarIcon,
         KeyIcon, CreditCardIcon as CardIcon } from '@heroicons/react/24/outline';
import Roles from './components/Roles';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clientes', href: '/clientes', icon: UserGroupIcon },
  { name: 'Cuentas', href: '/cuentas', icon: CreditCardIcon },
  { name: 'Tarjetas', href: '/tarjetas', icon: CardIcon },
  { name: 'Préstamos', href: '/prestamos', icon: CurrencyDollarIcon },
  { name: 'Asesores', href: '/asesores', icon: ClipboardDocumentListIcon },
  { name: 'Roles', href: '/roles', icon: KeyIcon },
  { name: 'Morosidad', href: '/morosidad', icon: ExclamationTriangleIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
];

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 bg-blue-600">
              <h1 className="text-xl font-bold text-white">TecBank Admin</h1>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
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

        {/* Main content */}
        <div className="pl-64">
          <header className="bg-white shadow">
            <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
            </div>
          </header>
          <main>
            <div className="py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/clientes" element={<Clientes />} />
                <Route path="/cuentas" element={<Cuentas />} />
                <Route path="/tarjetas" element={<Tarjetas />} />
                <Route path="/prestamos" element={<Prestamos />} />
                <Route path="/asesores" element={<Asesores />} />
                <Route path="/roles" element={<Roles />} />
                <Route path="/morosidad" element={<Morosidad />} />
                <Route path="/reportes" element={<Reportes />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  );
}

// Componentes de las páginas
function Dashboard() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Total Clientes</h3>
        <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Préstamos Activos</h3>
        <p className="mt-2 text-3xl font-bold text-green-600">0</p>
      </div>
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900">Cuentas Morosas</h3>
        <p className="mt-2 text-3xl font-bold text-red-600">0</p>
      </div>
    </div>
  );
}

function Clientes() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Agregar Cliente
        </button>
      </div>
    </div>
  );
}

function Cuentas() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Cuentas</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Agregar Cuenta
        </button>
      </div>
    </div>
  );
}

function Prestamos() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Préstamos</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Agregar Préstamo
        </button>
      </div>
    </div>
  );
}

function Asesores() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Asesores</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Agregar Asesor
        </button>
      </div>
    </div>
  );
}

function Morosidad() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Morosidad</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Ver Reporte de Morosidad
        </button>
      </div>
    </div>
  );
}

function Reportes() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Reportes</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Generar Reporte
        </button>
      </div>
    </div>
  );
}

function Tarjetas() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Gestión de Tarjetas</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Agregar Tarjeta
        </button>
      </div>
    </div>
  );
}

export default App;

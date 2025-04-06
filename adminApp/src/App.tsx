import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomeIcon, UserGroupIcon, CreditCardIcon, 
         CurrencyDollarIcon, ClipboardDocumentListIcon, 
         ExclamationTriangleIcon, ChartBarIcon,
         KeyIcon, CreditCardIcon as CardIcon, UserIcon } from '@heroicons/react/24/outline';
import Roles from './components/Roles';
import Cuentas from './components/Cuentas';
import Prestamos from './components/Prestamos';
import Layout from './components/Layout';
import Reportes from './components/Reportes';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clientes', href: '/clientes', icon: UserGroupIcon },
  { name: 'Cuentas', href: '/cuentas', icon: CardIcon },
  { name: 'Tarjetas', href: '/tarjetas', icon: CardIcon },
  { name: 'Préstamos', href: '/prestamos', icon: CurrencyDollarIcon },
  { name: 'Asesores', href: '/asesores', icon: ClipboardDocumentListIcon },
  { name: 'Roles', href: '/roles', icon: KeyIcon },
  { name: 'Morosidad', href: '/morosidad', icon: ExclamationTriangleIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  { name: 'Usuarios', href: '/usuarios', icon: UserIcon },
];

function App() {
  return (
    <Router>
      <Layout navigation={navigation}>
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
      </Layout>
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

/*
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
*/

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

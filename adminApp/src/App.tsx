import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Clientes from './components/Clientes';
import Cuentas from './components/Cuentas';
import Prestamos from './components/Prestamos';
import Tarjetas from './components/Tarjetas';
import Asesores from './components/Asesores';
import Reportes from './components/Reportes';
import Roles from './components/Roles';
import {
  HomeIcon,
  UsersIcon,
  BanknotesIcon,
  CreditCardIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/', icon: HomeIcon },
  { name: 'Clientes', href: '/clientes', icon: UsersIcon },
  { name: 'Cuentas', href: '/cuentas', icon: BanknotesIcon },
  { name: 'Préstamos', href: '/prestamos', icon: ClipboardDocumentListIcon },
  { name: 'Tarjetas', href: '/tarjetas', icon: CreditCardIcon },
  { name: 'Asesores', href: '/asesores', icon: UserGroupIcon },
  { name: 'Reportes', href: '/reportes', icon: ChartBarIcon },
  { name: 'Roles', href: '/roles', icon: ShieldCheckIcon }
];

function App() {
  return (
    <Router>
      <Layout navigation={navigation}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/cuentas" element={<Cuentas />} />
          <Route path="/prestamos" element={<Prestamos />} />
          <Route path="/tarjetas" element={<Tarjetas />} />
          <Route path="/asesores" element={<Asesores />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/roles" element={<Roles />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;

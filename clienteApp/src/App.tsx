import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HomeIcon, CreditCardIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import MisCuentas from './components/MisCuentas';
import Tarjetas from './components/Tarjetas';
import Prestamos from './components/Prestamos';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const navigation = [
  { name: 'Inicio', href: '/dashboard', icon: HomeIcon },
  { name: 'Mis Cuentas', href: '/dashboard/cuentas', icon: CurrencyDollarIcon },
  { name: 'Tarjetas', href: '/dashboard/tarjetas', icon: CreditCardIcon },
  { name: 'Préstamos', href: '/dashboard/prestamos', icon: CurrencyDollarIcon }
];

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  return user ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Layout navigation={navigation} />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="cuentas" element={<MisCuentas />} />
            <Route path="tarjetas" element={<Tarjetas />} />
            <Route path="prestamos" element={<Prestamos />} />
          </Route>
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
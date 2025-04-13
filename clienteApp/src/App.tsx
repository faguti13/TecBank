import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { HomeIcon,  CreditCardIcon, 
         CurrencyDollarIcon, CreditCardIcon as CardIcon, UserIcon, 
         QuestionMarkCircleIcon, BanknotesIcon, PhoneIcon,
         EnvelopeIcon,
         ChatBubbleLeftRightIcon,
         DocumentIcon,
         ClockIcon} from '@heroicons/react/24/outline';

import Layout from './components/Layout';


const navigation = [
  { name: 'Inicio', href: '/', icon: HomeIcon },
  { name: 'Mis Cuentas', href: '/cuentas', icon: BanknotesIcon, 
    submenu: [
      { name: 'Movimientos', href: '/cuentas/movimientos' },
      { name: 'Transferencias', href: '/cuentas/transferencias' },
      { name: 'Tarjetas de débito', href: '/cuentas/tarjetas' }
    ]
  },
  { name: 'Mis Tarjetas', href: '/tarjetas', icon: CreditCardIcon,
    submenu: [
      { name: 'Pago de tarjetas', href: '/tarjetas/pago' },
      { name: 'Historial de compras', href: '/tarjetas/historial' }
    ]
  },
  { name: 'Mis Préstamos', href: '/prestamos', icon: CurrencyDollarIcon,
    submenu: [
      { name: 'Pago regular', href: '/prestamos/pago' },
      { name: 'Pago extraordinario', href: '/prestamos/pago-extra' }
    ]
  },
  { name: 'Ayuda', href: '/ayuda', icon: QuestionMarkCircleIcon }
];

function App() {
  return (
    <Router>
      <Layout navigation={navigation}>
      <Routes>
          <Route path="/" element={<DashboardCliente />} />
          
          {/* Rutas de Cuentas */}
          <Route path="/cuentas" element={<MisCuentas />} />
          <Route path="/cuentas/movimientos" element={<MovimientosCuenta />} />
          <Route path="/cuentas/transferencias" element={<Transferencias />} />
          <Route path="/cuentas/tarjetas" element={<TarjetasDebito />} />
          
          {/* Rutas de Tarjetas */}
          <Route path="/tarjetas" element={<MisTarjetas />} />
          <Route path="/tarjetas/pago" element={<PagoTarjetas />} />
          <Route path="/tarjetas/historial" element={<HistorialCompras />} />
          
          {/* Rutas de Préstamos */}
          <Route path="/prestamos" element={<MisPrestamos />} />
          <Route path="/prestamos/pago" element={<PagoRegular />} />
          <Route path="/prestamos/pago-extra" element={<PagoExtraordinario />} />
          
          {/* Otras rutas */}
          <Route path="/ayuda" element={<AyudaCliente />} />
      </Routes>
      </Layout>
    </Router>
  );
}
// Componentes de las páginas
function DashboardCliente() {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-base font-medium text-gray-900">Saldo Total</h3>
          <p className="mt-2 text-2xl font-bold text-blue-600">$0</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-base font-medium text-gray-900">Próximo Pago</h3>
          <p className="mt-2 text-2xl font-bold text-green-600">$0</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
          <h3 className="text-base font-medium text-gray-900">Préstamo Activo</h3>
          <p className="mt-2 text-2xl font-bold text-purple-600">$0</p>
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
        <h3 className="mb-3 text-base font-medium text-gray-900">Accesos Rápidos</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Link to="/cuentas/transferencias" 
                className="flex flex-col items-center p-2 text-center transition-colors rounded-lg hover:bg-gray-50">
            <div className="p-2 mb-1 bg-blue-50 rounded-full">
              <BanknotesIcon className="w-6 h-6 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-900">Transferir</span>
          </Link>
          <Link to="/prestamos/pago" 
                className="flex flex-col items-center p-2 text-center transition-colors rounded-lg hover:bg-gray-50">
            <div className="p-2 mb-1 bg-green-50 rounded-full">
              <CurrencyDollarIcon className="w-6 h-6 text-green-500" />
            </div>
            <span className="text-sm font-medium text-gray-900">Pagar Préstamo</span>
          </Link>
          <Link to="/tarjetas" 
                className="flex flex-col items-center p-2 text-center transition-colors rounded-lg hover:bg-gray-50">
            <div className="p-2 mb-1 bg-purple-50 rounded-full">
              <CreditCardIcon className="w-6 h-6 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-900">Ver Tarjetas</span>
          </Link>
          <Link to="/cuentas/movimientos" 
                className="flex flex-col items-center p-2 text-center transition-colors rounded-lg hover:bg-gray-50">
            <div className="p-2 mb-1 bg-gray-50 rounded-full">
              <HomeIcon className="w-6 h-6 text-gray-500" />
            </div>
            <span className="text-sm font-medium text-gray-900">Movimientos</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function MisCuentas() {
  return (
    <div className="space-y-6">
      {/* Encabezado con botón */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Mis Cuentas</h2>
        <button className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md sm:w-auto hover:bg-blue-700">
          Nueva Cuenta
        </button>
      </div>

      {/* Listado de cuentas */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tarjeta de cuenta 1 */}
        <div className="p-4 bg-white rounded-lg shadow sm:p-6">
          <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
            <div>
              <h3 className="text-base font-medium text-gray-900 sm:text-lg">Cuenta Ahorros</h3>
              <p className="text-sm text-gray-500">****-7890</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Activa</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 sm:text-3xl">$0</p>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800">
            Ver movimientos →
          </button>
        </div>

        {/* Tarjeta de cuenta 2 */}
        <div className="p-4 bg-white rounded-lg shadow sm:p-6">
          <div className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:items-start sm:space-y-0">
            <div>
              <h3 className="text-base font-medium text-gray-900 sm:text-lg">Cuenta Corriente</h3>
              <p className="text-sm text-gray-500">****-4567</p>
            </div>
            <span className="inline-flex px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">Activa</span>
          </div>
          <p className="mt-3 text-2xl font-bold text-blue-600 sm:text-3xl">$0</p>
          <button className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800">
            Ver movimientos →
          </button>
        </div>
      </div>
    </div>
  );
}


function MovimientosCuenta() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Movimientos</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Filtrar
        </button>
      </div>
    </div>
  );
}

function Transferencias() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Transferencias</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Nueva Transferencia
        </button>
      </div>
    </div>
  );
}

function TarjetasDebito() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Tarjetas</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Ver Todas
        </button>
      </div>
    </div>
  );
}

function MisTarjetas() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Mis Tarjetas</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Gestionar
        </button>
      </div>
    </div>
  );
}

function PagoTarjetas() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Pago Tarjetas</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Pagar Ahora
        </button>
      </div>
    </div>
  );
}

function HistorialCompras() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Historial</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Consultar
        </button>
      </div>
    </div>
  );
}

function MisPrestamos() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Mis Préstamos</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Ver Detalles
        </button>
      </div>
    </div>
  );
}

function PagoRegular() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Pago Regular</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Realizar Pago
        </button>
      </div>
    </div>
  );
}

function PagoExtraordinario() {
  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900">Pago Extra</h2>
      <div className="mt-4">
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Abonar Capital
        </button>
      </div>
    </div>
  );
}


function AyudaCliente() {
  const [activeTab, setActiveTab] = useState('faq');
  
  // FAQ items
  const faqItems = [
    {
      question: "¿Cómo puedo transferir dinero entre mis cuentas?",
      answer: "Para transferir dinero entre sus cuentas, vaya a la sección 'Mis Cuentas', seleccione 'Transferencias' y siga las instrucciones para realizar la transferencia."
    },
    {
      question: "¿Qué hago si olvidé mi contraseña?",
      answer: "Si olvidó su contraseña, en la pantalla de inicio de sesión haga clic en '¿Olvidó su contraseña?' y siga las instrucciones para restablecerla."
    },
    {
      question: "¿Cómo puedo reportar una tarjeta perdida o robada?",
      answer: "Para reportar una tarjeta perdida o robada, llame inmediatamente a nuestro centro de atención al cliente al 800-TECBANK (800-832-2265) disponible 24/7."
    },
    {
      question: "¿Cómo solicito un nuevo préstamo?",
      answer: "Para solicitar un nuevo préstamo, visite cualquiera de nuestras sucursales o contacte a su asesor de crédito asignado."
    }
  ];
  
  // Contact information
  const contactInfo = {
    phoneNumbers: [
      { title: "Atención al Cliente", number: "800-TECBANK (800-832-2265)" },
      { title: "Soporte Técnico", number: "800-SOPORTE (800-767-6783)" },
      { title: "Emergencias (Tarjetas)", number: "800-EMERGENCIA (800-364-7436)" }
    ],
    email: "ayuda@tecbank.com",
    hours: "Lunes a Viernes: 8:00 AM - 7:00 PM | Sábados: 9:00 AM - 1:00 PM"
  };

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Centro de Ayuda</h2>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
          Contactar Ahora
        </button>
      </div>
      
      {/* Tabs */}
      <div className="flex space-x-1 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('faq')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'faq' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Preguntas Frecuentes
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'contact' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Contacto
        </button>
      </div>
      
      {/* Tab content */}
      <div className="p-4 bg-white rounded-lg shadow">
        {activeTab === 'faq' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <QuestionMarkCircleIcon className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900">Preguntas Frecuentes</h3>
            </div>
            
            <div className="space-y-4">
              {faqItems.map((item, index) => (
                <details key={index} className="p-4 border border-gray-200 rounded-lg group">
                  <summary className="flex items-center justify-between cursor-pointer">
                    <span className="font-medium text-gray-700">{item.question}</span>
                    <span className="text-blue-500 transition-transform group-open:rotate-180">
                      &#x25BC;
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <PhoneIcon className="w-6 h-6 text-blue-500" />
              <h3 className="text-lg font-medium text-gray-900">Números de Teléfono</h3>
            </div>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {contactInfo.phoneNumbers.map((phone, index) => (
                <div key={index} className="p-4 transition-shadow bg-gray-50 rounded-lg hover:shadow">
                  <h4 className="text-sm font-medium text-gray-500">{phone.title}</h4>
                  <p className="mt-1 text-lg font-bold text-blue-600">{phone.number}</p>
                </div>
              ))}
            </div>
            
            <div className="p-4 mt-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <EnvelopeIcon className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium text-gray-700">Correo Electrónico</h4>
              </div>
              <p className="mt-1 text-blue-600">{contactInfo.email}</p>
              
              <div className="flex items-center mt-4 space-x-2">
                <ClockIcon className="w-5 h-5 text-blue-500" />
                <h4 className="font-medium text-gray-700">Horario de Atención</h4>
              </div>
              <p className="mt-1 text-gray-600">{contactInfo.hours}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

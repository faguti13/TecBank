import React, { useState } from 'react';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import { RegisterRequest } from '../types/auth';

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<RegisterRequest>({
        cedula: '',
        nombre: '',
        apellido1: '',
        apellido2: '',
        direccion: '',
        telefono: '',
        usuario: '',
        password: '',
        tipoCliente: 'Físico'
    });
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        try {
            await authService.register(formData);
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al registrar usuario');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Registro de Cliente
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline">{error}</span>
                        </div>
                    )}
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="cedula" className="block text-sm font-medium text-gray-700">Cédula</label>
                            <input
                                id="cedula"
                                name="cedula"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.cedula}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="apellido1" className="block text-sm font-medium text-gray-700">Primer Apellido</label>
                            <input
                                id="apellido1"
                                name="apellido1"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.apellido1}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="apellido2" className="block text-sm font-medium text-gray-700">Segundo Apellido</label>
                            <input
                                id="apellido2"
                                name="apellido2"
                                type="text"
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.apellido2}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="direccion" className="block text-sm font-medium text-gray-700">Dirección</label>
                            <input
                                id="direccion"
                                name="direccion"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.direccion}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">Teléfono</label>
                            <input
                                id="telefono"
                                name="telefono"
                                type="tel"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.telefono}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="usuario" className="block text-sm font-medium text-gray-700">Usuario</label>
                            <input
                                id="usuario"
                                name="usuario"
                                type="text"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.usuario}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="tipoCliente" className="block text-sm font-medium text-gray-700">Tipo de Cliente</label>
                            <select
                                id="tipoCliente"
                                name="tipoCliente"
                                required
                                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={formData.tipoCliente}
                                onChange={handleChange}
                            >
                                <option value="Físico">Físico</option>
                                <option value="Jurídico">Jurídico</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Registrarse
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <button
                        onClick={() => navigate('/login')}
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        ¿Ya tienes cuenta? Inicia sesión
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Register; 
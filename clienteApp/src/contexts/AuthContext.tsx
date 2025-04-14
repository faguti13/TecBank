import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config';

interface User {
  id: number;
  usuario: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  cedula: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loginError: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    // Verificar si hay un usuario guardado en localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    setLoginError(null);
    setIsLoading(true);
    
    const loginUrl = `${API_BASE_URL}/api/auth/login`;
    console.log(`Intentando conectar a: ${loginUrl}`);
    
    try {
      console.log('Datos de envío:', { usuario: username, password: '******' });
      
      // Configuración ampliada para fetch
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json, text/plain, */*',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify({ usuario: username, password }),
        mode: 'cors' as RequestMode,
        cache: 'no-cache' as RequestCache,
        credentials: 'omit' as RequestCredentials,
        redirect: 'follow' as RequestRedirect,
        referrerPolicy: 'no-referrer' as ReferrerPolicy,
        timeout: 10000, // No es una opción estándar de fetch, pero ilustra el tiempo límite
      };
      
      console.log('Intentando fetch con opciones:', { ...fetchOptions, body: '***HIDDEN***' });
      
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout al conectar con el servidor')), 10000)
      );
      
      const fetchPromise = fetch(loginUrl, fetchOptions);
      
      // Usar Promise.race para implementar un timeout manual
      const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;
      
      console.log('Respuesta recibida - Estado:', response.status, response.statusText);
      
      if (!response.ok) {
        // Intentar leer el cuerpo del error si existe
        let errorBody = '';
        try {
          errorBody = await response.text();
          console.error('Cuerpo de la respuesta de error:', errorBody);
        } catch (e) {
          console.error('No se pudo leer el cuerpo de la respuesta');
        }
        
        throw new Error(`Error en la petición: ${response.status} ${response.statusText}. ${errorBody}`);
      }

      const userData = await response.json();
      console.log('Datos de usuario recibidos:', userData);
      
      const userToStore = {
        id: userData.id,
        usuario: userData.usuario,
        nombre: userData.nombre,
        apellido1: userData.apellido1,
        apellido2: userData.apellido2,
        cedula: userData.cedula
      };
      
      setUser(userToStore);
      localStorage.setItem('user', JSON.stringify(userToStore));
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error de red: Failed to fetch';
      
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          errorMessage = 'Error de red: No se pudo conectar al servidor. Verifica tu conexión y que el servidor esté funcionando.';
        } else if (error.message.includes('Timeout')) {
          errorMessage = 'La conexión tardó demasiado. Verifica tu red o si el servidor está sobrecargado.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setLoginError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loginError, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
} 
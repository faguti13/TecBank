import { LoginRequest, Cliente } from '../types/auth';

const API_URL = 'http://localhost:5240/api';

export const authService = {
    async login(credentials: LoginRequest): Promise<Cliente> {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Usuario o contraseña incorrectos');
            }
            const error = await response.text();
            throw new Error(error || 'Error al iniciar sesión');
        }

        const data = await response.json();
        return data;
    },

    async getCurrentUser(): Promise<Cliente | null> {
        const userStr = localStorage.getItem('user');
        if (!userStr) return null;
        return JSON.parse(userStr);
    },

    logout(): void {
        localStorage.removeItem('user');
    }
}; 
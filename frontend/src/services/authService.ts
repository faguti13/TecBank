import { LoginRequest, RegisterRequest, Cliente } from '../types/auth';

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
            const error = await response.text();
            throw new Error(error);
        }

        return response.json();
    },

    async register(userData: RegisterRequest): Promise<Cliente> {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(error);
        }

        return response.json();
    },
}; 
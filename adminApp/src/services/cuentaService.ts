interface Cuenta {
    id?: number;
    numeroCuenta: string;
    descripcion: string;
    moneda: 'Colones' | 'Dólares' | 'Euros';
    tipoCuenta: 'Ahorros' | 'Corriente';
    nombreCliente: string;  // Cambiado de cedulaCliente a nombreCliente
}

// URL base de la API
const API_URL = 'http://localhost:5240/api/Cuentas';

export const cuentaService = {
    // Obtener todas las cuentas
    getAll: async (): Promise<Cuenta[]> => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al obtener cuentas:', error);
            throw error;
        }
    },

    // Obtener una cuenta por ID
    getById: async (id: number): Promise<Cuenta> => {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error al obtener cuenta con ID ${id}:`, error);
            throw error;
        }
    },

    // Crear una nueva cuenta
    create: async (cuenta: Cuenta): Promise<Cuenta> => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cuenta)
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al crear cuenta:', error);
            throw error;
        }
    },

    // Actualizar una cuenta existente
    update: async (id: number, cuenta: Cuenta): Promise<Cuenta> => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cuenta)
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error al actualizar cuenta con ID ${id}:`, error);
            throw error;
        }
    },

    // Eliminar una cuenta
    delete: async (id: number): Promise<void> => {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error(`Error al eliminar cuenta con ID ${id}:`, error);
            throw error;
        }
    }
};
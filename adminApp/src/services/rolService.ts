interface Rol {
    id?: number;
    nombre: string;
    descripcion: string;
}

const API_URL = 'http://localhost:5240/api';

export const rolService = {
    async getAll(): Promise<Rol[]> {
        const response = await fetch(`${API_URL}/roles`);
        if (!response.ok) {
            throw new Error('Error al obtener roles');
        }
        return response.json();
    },

    async getById(id: number): Promise<Rol> {
        const response = await fetch(`${API_URL}/roles/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el rol');
        }
        return response.json();
    },

    async create(rol: Rol): Promise<Rol> {
        const response = await fetch(`${API_URL}/roles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rol),
        });
        if (!response.ok) {
            throw new Error('Error al crear el rol');
        }
        return response.json();
    },

    async update(id: number, rol: Rol): Promise<void> {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(rol),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar el rol');
        }
    },

    async delete(id: number): Promise<void> {
        const response = await fetch(`${API_URL}/roles/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }
    },
}; 
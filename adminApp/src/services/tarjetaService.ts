// services/tarjetaService.ts

export interface Tarjeta {
    //idCliente: number;
    numeroCuenta: string;
    numeroTarjeta: string;
    tipoTarjeta: 'Debito' | 'Credito';
    saldoDisponible?: number;
    montoCredito?: number;
    fechaExpiracion: string;
    codigoSeguridad: string;
  }

const API_URL = 'http://localhost:5240/api';

export const tarjetaService = {
    async getAll(): Promise<Tarjeta[]> {
        const response = await fetch(`${API_URL}/tarjeta`);
        if (!response.ok) {
            throw new Error('Error al obtener tarjetas');
        }
        return response.json();
    },

    async getById(id: number): Promise<Tarjeta> {
        const response = await fetch(`${API_URL}/tarjeta/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la tarjeta');
        }
        return response.json();
    },

    async create(tarjeta: Tarjeta): Promise<Tarjeta> {
        const response = await fetch(`${API_URL}/tarjeta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarjeta)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData); // Ver detalles del error
            throw new Error(errorData);
        }
        
        return response.json();
    },


    async verificarCuenta(numeroCuenta: string): Promise<void> {
        const response = await fetch(`${API_URL}/cuentas/buscar/${numeroCuenta}`);
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('El número de cuenta no existe');
            } else {
                throw new Error('Error al verificar el número de cuenta');
            }
        }
        return response.json(); 
    },

    async verificarUnicidadCuenta(numeroCuenta: string): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/buscarPorCuenta/${numeroCuenta}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('El número de cuenta no está asociado a una cuenta');
            } else {
                throw new Error('Error al verificar el número de cuenta');
            }
        }
        return response.json(); 
    }
    
      


}; 
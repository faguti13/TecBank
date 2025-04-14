import { API_BASE_URL } from '../config';

export interface Transaccion {
    id: number;
    cuentaOrigenId: number;
    cuentaDestinoId?: number;
    monto: number;
    tipo: string;
    fecha: string;
    descripcion: string;
    estado: string;
}

export interface MovimientoRequest {
    cuentaId: number;
    monto: number;
    descripcion: string;
}

export const registrarDeposito = async (request: MovimientoRequest): Promise<Transaccion> => {
    const response = await fetch(`${API_BASE_URL}/api/Transacciones/deposito`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al realizar el depósito');
    }

    return response.json();
};

export const registrarRetiro = async (request: MovimientoRequest): Promise<Transaccion> => {
    const response = await fetch(`${API_BASE_URL}/api/Transacciones/retiro`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al realizar el retiro');
    }

    return response.json();
}; 
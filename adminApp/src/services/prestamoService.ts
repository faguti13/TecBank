export enum TipoMoneda {
    Colones = 'Colones',
    Dolares = 'Dolares',
    Euros = 'Euros'
}

export interface Prestamo {
    id?: number;
    montoOriginal: number;
    saldo: number;
    clienteId?: number;
    cedulaCliente: string;
    asesorId: number;
    tasaInteres: number;
    plazoMeses: number;
    moneda: TipoMoneda;
    fechaCreacion?: Date;
    pagos?: PagoPrestamo[];
    calendarioPagos?: CalendarioPago[];
}

export interface PagoPrestamo {
    id?: number;
    prestamoId?: number;
    monto: number;
    fechaPago: Date;
    esPagoExtraordinario: boolean;
}

export interface CalendarioPago {
    id?: number;
    prestamoId?: number;
    numeroCuota: number;
    fechaProgramada: Date;
    montoAmortizacion: number;
    montoInteres: number;
    montoCuota: number;
    saldoProyectado: number;
    pagado: boolean;
}

const API_URL = 'http://localhost:5240/api';

export const prestamoService = {
    async getAll(): Promise<Prestamo[]> {
        const response = await fetch(`${API_URL}/prestamos`);
        if (!response.ok) {
            throw new Error('Error al obtener préstamos');
        }
        return response.json();
    },

    async getById(id: number): Promise<Prestamo> {
        const response = await fetch(`${API_URL}/prestamos/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener el préstamo');
        }
        return response.json();
    },

    async create(prestamo: Prestamo): Promise<Prestamo> {
        const response = await fetch(`${API_URL}/prestamos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(prestamo)
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        
        return response.json();
    },

    async registrarPago(prestamoId: number, pago: PagoPrestamo): Promise<void> {
        const response = await fetch(`${API_URL}/prestamos/${prestamoId}/pagos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(pago),
        });
        if (!response.ok) {
            throw new Error('Error al registrar el pago');
        }
    },
}; 
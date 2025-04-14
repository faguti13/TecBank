import { API_BASE_URL } from '../config';
//import { TipoMoneda } from './monedaService';

export interface Tarjeta {
    //idCliente: number;
    numeroCuenta: string;
    numeroTarjeta: string;
    tipoTarjeta: 'Debito' | 'Credito';
    saldoDisponible?: number;
    montoCredito?: number;
    fechaExpiracion: string;
    codigoSeguridad: string;
    montoSinCancelar: number;
  }

  export interface Compra {
    numeroTarjeta: string;
    monto: string;
    fecha: string;
}

export interface Pago {
    numeroTarjeta: string;
    montoP: string;
    fechaP: string;
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

    async compraGetByNumTarjeta(numeroTarjeta: string): Promise<Compra[]> {
        try {
          const response = await fetch(`${API_URL}/tarjeta/compras/${numeroTarjeta}`);
          if (!response.ok) {
            throw new Error('Error al obtener las compras por el num de tarjeta');
          }
          return response.json(); // Asegúrate de que la respuesta sea un array de compras
        } catch (error) {
          console.error('Error al obtener las compras desde el servicio', error);
          throw error; // Re-lanza el error para manejarlo en el componente
        }
      },
      


    async registrarPago(pago: Pago): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/pagos`, {
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

    async actualizarSaldo(numeroTarjeta: string, nuevoMonto: number): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/actualizarSaldo`, {
            method: 'PUT',  // PUT porque actualiza un dato
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                numeroTarjeta,
                nuevoMonto,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al actualizar el monto de la tarjeta');
        }
    },

}; 
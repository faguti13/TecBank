import { API_BASE_URL } from '../config';
import { TipoMoneda } from './monedaService';
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

export interface Cuenta {
  id: number;
  numeroCuenta: string;
  descripcion: string;
  moneda: TipoMoneda;
  tipoCuenta: string;
  cedulaCliente: string;
  saldo: number;
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

    async buscarCuentaPorCedula(cedulaCliente: string): Promise<Cuenta[]> {
        const response = await fetch(`${API_BASE_URL}/api/Cuentas/buscarCedula/${cedulaCliente}`);
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al buscar la cuenta por la cédula');
        }
        return response.json(); // devuelve un array de cuentas
    },

    async getByNumeroCuenta(numeroCuenta: string): Promise<Tarjeta> {
        const response = await fetch(`${API_URL}/tarjeta/buscarNumeroCuenta/${numeroCuenta}`);
        if (!response.ok) {
            throw new Error('Error al obtener la tarjeta');
        }
        return response.json();
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
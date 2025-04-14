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

export const tarjetaService = {
    async getAll(): Promise<Tarjeta[]> {
        const response = await fetch(`${API_BASE_URL}/api/tarjeta`);
        if (!response.ok) {
            throw new Error('Error al obtener tarjetas');
        }
        return response.json();
    },

    async compraGetByNumTarjeta(numeroTarjeta: string): Promise<Compra[]> {
        try {
          console.log('Fetching compras para tarjeta:', numeroTarjeta);
          const url = `${API_BASE_URL}/api/tarjeta/compras/${numeroTarjeta}`;
          console.log('URL de compras:', url);
          
          const response = await fetch(url);
          console.log('Respuesta compras Status:', response.status);
          
          if (!response.ok) {
            throw new Error('Error al obtener las compras por el num de tarjeta');
          }
          
          const data = await response.json();
          console.log('Datos de compras recibidos:', data);
          return data;
        } catch (error) {
          console.error('Error al obtener las compras desde el servicio', error);
          throw error;
        }
      },

    async buscarCuentaPorCedula(cedulaCliente: string): Promise<Cuenta[]> {
        console.log('Buscando cuentas por cédula:', cedulaCliente);
        console.log('URL base API:', API_BASE_URL);
        
        const url = `${API_BASE_URL}/api/Cuentas/buscarCedula/${cedulaCliente}`;
        console.log('URL completa:', url);
        
        const response = await fetch(url);
        console.log('Status respuesta:', response.status);
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Error al buscar la cuenta por la cédula');
        }
        
        const data = await response.json();
        console.log('Datos recibidos:', data);
        return data;
    },

    async getByNumeroCuenta(numeroCuenta: string): Promise<Tarjeta> {
        const response = await fetch(`${API_BASE_URL}/api/tarjeta/buscarNumeroCuenta/${numeroCuenta}`);
        if (!response.ok) {
            throw new Error('Error al obtener la tarjeta');
        }
        return response.json();
    },
      

    async registrarPago(pago: Pago): Promise<void> {
        const response = await fetch(`${API_BASE_URL}/api/tarjeta/pagos`, {
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
        const response = await fetch(`${API_BASE_URL}/api/tarjeta/actualizarSaldo`, {
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
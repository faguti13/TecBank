import { API_BASE_URL } from '../config';
import { TipoMoneda } from './monedaService';

export interface Transaccion {
  id: number;
  tipo: string;
  monto: number;
  montoDestino: number;
  monedaOrigen: TipoMoneda;
  monedaDestino: TipoMoneda;
  fecha: string;
  descripcion: string;
  estado: string;
  cuentaOrigenId: number;
  cuentaDestinoId?: number;
}

export interface TransferenciaRequest {
  cuentaOrigenId: number;
  cuentaDestinoId: number;
  monto: number;
  descripcion: string;
  monedaOrigen: TipoMoneda;
}

export interface MovimientoRequest {
  cuentaId: number;
  monto: number;
  descripcion: string;
  monedaOrigen: TipoMoneda;
}

export const getTransaccionesByCuenta = async (cuentaId: number): Promise<Transaccion[]> => {
  const response = await fetch(`${API_BASE_URL}/api/Transacciones/cuenta/${cuentaId}`);
  if (!response.ok) {
    throw new Error('Error al obtener las transacciones');
  }
  return response.json();
};

export const realizarTransferencia = async (request: TransferenciaRequest): Promise<Transaccion> => {
  const response = await fetch(`${API_BASE_URL}/api/Transacciones/transferencia`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al realizar la transferencia');
  }

  return response.json();
};

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
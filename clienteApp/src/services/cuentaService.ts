import { API_BASE_URL } from '../config';
import { TipoMoneda } from './monedaService';

export interface Cuenta {
  id: number;
  numeroCuenta: string;
  descripcion: string;
  moneda: TipoMoneda;
  tipoCuenta: string;
  cedulaCliente: string;
  saldo: number;
}

export const buscarCuentaPorNumero = async (numeroCuenta: string): Promise<Cuenta> => {
  const response = await fetch(`${API_BASE_URL}/api/Cuentas/buscar/${numeroCuenta}`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error al buscar la cuenta');
  }
  return response.json();
}; 



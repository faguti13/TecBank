import { API_BASE_URL } from '../config';
import { TipoMoneda } from './monedaService';
import { config } from '../config';

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

class CuentaService {
  private baseUrl = `${config.apiUrl}/api/cuentas`;

  async getCuentasByCliente(cedula: string): Promise<Cuenta[]> {
    try {
      const response = await fetch(`${this.baseUrl}/cliente/${cedula}`);
      if (!response.ok) {
        throw new Error('Error al obtener las cuentas del cliente');
      }
      return await response.json();
    } catch (error) {
      console.error('Error en getCuentasByCliente:', error);
      throw error;
    }
  }
}

export const cuentaService = new CuentaService(); 



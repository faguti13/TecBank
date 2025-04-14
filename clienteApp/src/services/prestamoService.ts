export interface Prestamo {
  id: number;
  montoOriginal: number;
  saldo: number;
  tasaInteres: number;
  plazoMeses: number;
  moneda: string;
  fechaCreacion: string;
  calendarioPagos: CalendarioPago[];
}

export interface CalendarioPago {
  id: number;
  prestamoId: number;
  numeroCuota: number;
  fechaProgramada: string;
  montoAmortizacion: number;
  montoInteres: number;
  montoCuota: number;
  saldoProyectado: number;
  pagado: boolean;
}

export interface PagoPrestamo {
  monto: number;
  fechaPago: Date;
  esPagoExtraordinario: boolean;
}

const API_URL = 'http://localhost:5240/api';

export const prestamoService = {
  async getPrestamosByCliente(cedula: string): Promise<Prestamo[]> {
    console.log('PrestamoService: Iniciando getPrestamosByCliente para cédula:', cedula);
    
    try {
      const url = `${API_URL}/prestamos/cliente/${cedula}`;
      console.log('PrestamoService: Haciendo fetch a:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        console.error('PrestamoService: Error de red:', error);
        throw new Error('Error de conexión. Por favor, verifica tu conexión a internet y que el servidor esté disponible.');
      });
      
      console.log('PrestamoService: Status de la respuesta:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('PrestamoService: Error response:', errorText);
        if (response.status === 404) {
          return []; // Si no hay préstamos, devolvemos un array vacío
        }
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      const data = await response.json().catch(error => {
        console.error('PrestamoService: Error al parsear JSON:', error);
        throw new Error('Error al procesar la respuesta del servidor');
      });
      
      console.log('PrestamoService: Datos recibidos:', data);
      
      if (!Array.isArray(data)) {
        console.error('PrestamoService: La respuesta no es un array:', data);
        throw new Error('La respuesta del servidor no tiene el formato esperado');
      }
      
      return data;
    } catch (error) {
      console.error('PrestamoService: Error en getPrestamosByCliente:', error);
      throw error;
    }
  },

  async registrarPago(prestamoId: number, pago: PagoPrestamo): Promise<void> {
    console.log('PrestamoService: Iniciando registrarPago para préstamo:', prestamoId);
    
    try {
      const response = await fetch(`${API_URL}/prestamos/${prestamoId}/pagos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pago),
        credentials: 'include'
      }).catch(error => {
        console.error('PrestamoService: Error de red al registrar pago:', error);
        throw new Error('Error de conexión al intentar registrar el pago');
      });
      
      console.log('PrestamoService: Status de la respuesta de pago:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('PrestamoService: Error en registrarPago:', errorText);
        throw new Error(`Error al registrar el pago: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error('PrestamoService: Error en registrarPago:', error);
      throw error;
    }
  }
}; 
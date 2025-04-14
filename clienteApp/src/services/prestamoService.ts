import { API_BASE_URL } from '../config';

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
  cuentaId: number;
}

export const prestamoService = {
  async getPrestamosByCliente(cedula: string): Promise<Prestamo[]> {
    console.log('PrestamoService: Iniciando getPrestamosByCliente para cédula:', cedula);
    
    try {
      const url = `${API_BASE_URL}/api/prestamos/cliente/${cedula}`;
      console.log('PrestamoService: Haciendo fetch a:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }).catch(error => {
        console.error('PrestamoService: Error de red:', error);
        throw new Error('Error de conexión. Por favor, verifica tu conexión a internet y que el servidor esté disponible.');
      });
      
      console.log('PrestamoService: Status de la respuesta:', response.status);
      
      // Manejar el caso de respuesta vacía (No Content)
      if (response.status === 204) {
        console.log('PrestamoService: No hay préstamos para este cliente');
        return [];
      }
      
      if (!response.ok) {
        let errorMessage = 'Error del servidor';
        try {
          const errorText = await response.text();
          console.error('PrestamoService: Error response:', errorText);
          errorMessage = `${errorMessage}: ${response.status} - ${errorText}`;
        } catch (e) {
          console.error('PrestamoService: No se pudo leer el texto de error');
        }
        
        if (response.status === 404) {
          console.log('PrestamoService: No se encontraron préstamos (404)');
          return []; // Si no hay préstamos, devolvemos un array vacío
        }
        
        throw new Error(errorMessage);
      }
      
      let data;
      try {
        data = await response.json();
        console.log('PrestamoService: Datos recibidos:', data);
      } catch (error) {
        console.error('PrestamoService: Error al parsear JSON:', error);
        throw new Error('Error al procesar la respuesta del servidor. La respuesta no es un JSON válido.');
      }
      
      if (!Array.isArray(data)) {
        console.error('PrestamoService: La respuesta no es un array:', data);
        if (data && typeof data === 'object') {
          // Intentar convertir un objeto a array si es posible
          return [data as Prestamo];
        }
        return []; // Devolver array vacío si no es posible convertir
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
      const response = await fetch(`${API_BASE_URL}/api/prestamos/${prestamoId}/pagos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(pago)
      }).catch(error => {
        console.error('PrestamoService: Error de red al registrar pago:', error);
        throw new Error('Error de conexión al intentar registrar el pago');
      });
      
      console.log('PrestamoService: Status de la respuesta de pago:', response.status);
      
      if (!response.ok) {
        let errorMessage = 'Error al registrar el pago';
        try {
          const errorText = await response.text();
          console.error('PrestamoService: Error en registrarPago:', errorText);
          errorMessage = `${errorMessage}: ${response.status} - ${errorText}`;
        } catch (e) {
          console.error('PrestamoService: No se pudo leer el texto de error');
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('PrestamoService: Error en registrarPago:', error);
      throw error;
    }
  }
}; 
// services/tarjetaService.ts

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


const API_URL = 'http://localhost:5240/api';

export const tarjetaService = {
    async getAll(): Promise<Tarjeta[]> {
        const response = await fetch(`${API_URL}/tarjeta`);
        if (!response.ok) {
            throw new Error('Error al obtener tarjetas');
        }
        return response.json();
    },

    async getById(id: number): Promise<Tarjeta> {
        const response = await fetch(`${API_URL}/tarjeta/${id}`);
        if (!response.ok) {
            throw new Error('Error al obtener la tarjeta');
        }
        return response.json();
    },

    async create(tarjeta: Tarjeta): Promise<Tarjeta> {
        const response = await fetch(`${API_URL}/tarjeta`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(tarjeta)
        });
        
        if (!response.ok) {
            const errorData = await response.text();
            console.error('Error response:', errorData); // Ver detalles del error
            throw new Error(errorData);
        }
        
        return response.json();
    },

    async deleteTarjeta(numeroTarjeta: string): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/${numeroTarjeta}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar el rol');
        }
    },


    async verificarCuenta(numeroCuenta: string): Promise<void> {
        const response = await fetch(`${API_URL}/cuentas/buscar/${numeroCuenta}`);
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('El número de cuenta no existe');
            } else {
                throw new Error('Error al verificar el número de cuenta');
            }
        }
        return response.json(); 
    },

    async verificarUnicidadCuenta(numeroCuenta: string): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/buscarPorCuenta/${numeroCuenta}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('El número de cuenta no está asociado a una cuenta');
            } else {
                throw new Error('Error al verificar el número de cuenta');
            }
        }
        return response.json(); 
    },
    
    async registrarCompra(compra: Compra): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/compras`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(compra),
        });
        if (!response.ok) {
            throw new Error('Error al registrar la compra');
        }
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
      


    async actualizarMonto(numeroTarjeta: string, nuevoMonto: number): Promise<void> {
        const response = await fetch(`${API_URL}/tarjeta/actualizarMonto`, {
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
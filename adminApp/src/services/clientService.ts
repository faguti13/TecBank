const API_URL = 'http://localhost:5240/api';

interface Cliente {
    id?: number;
    Cedula: string;
    Nombre: string;
    Apellido1: string;
    Apellido2: string;
    Direccion: string;
    Telefono: string;
    Usuario: string;
    Password: string;
    Email: string;
    IngresoMensual: number;
    TipoCliente: string;
}


export const clientService = {
    create: async (cliente: Cliente): Promise<Cliente> => {
        console.log(cliente);
        try {
            
            const response = await fetch(`${API_URL}/Cliente`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cliente)
            });
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error al crear cliente:', error);
            throw error;
        }
    },

    async getByCedula(Cedula: string): Promise<Cliente> {
        try{
            const response = await fetch(`${API_URL}/Cliente/${Cedula}`);
            if (!response.ok) {
                throw new Error('404');
            }
            return response.json();
        }catch(error){
            console.error('505', error);
            throw error;
        }
    },

    async editClientInfo(cliente: Cliente): Promise<void>{
        try{
            const response = await fetch(`${API_URL}/Cliente/${cliente.id}`, {
                method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(cliente),}
            );
            if (!response.ok) {
                throw new Error('Error aleditar los datos');
            }
        }catch(error){
            console.error('505', error);
            throw error;
        }
    },
};
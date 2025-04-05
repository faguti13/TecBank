export interface LoginRequest {
    usuario: string;
    password: string;
}

export interface RegisterRequest {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    direccion: string;
    telefono: string;
    usuario: string;
    password: string;
    tipoCliente: 'Físico' | 'Jurídico';
}

export interface Cliente {
    cedula: string;
    nombre: string;
    apellido1: string;
    apellido2?: string;
    direccion: string;
    telefono: string;
    usuario: string;
    tipoCliente: string;
} 
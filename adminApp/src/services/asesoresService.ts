// src/services/asesoresService.ts

interface Asesor {
    id?: number;
    cedula:string;
    nombre_1: string;
    nombre_2: string;
    apellido_1: string;
    apellido_2: string;
    fecha_nacimiento: string;
    meta_colones: number;
    meta_dolares: number;
  }
  
  const API_URL = 'http://localhost:5240/api/asesor';
  
  // Función para obtener todos los asesores
  export const getAllAsesores = async (): Promise<Asesor[]> => {
    try {
      const response = await fetch(API_URL);  
      if (!response.ok) {
        throw new Error('Error al obtener los asesores');
      }
      return await response.json(); 
    } catch (error) {
      console.error(error);
      throw new Error('No se pudieron cargar los asesores');
    }
  };
  
  // Función para crear un nuevo asesor
  export const createAsesor = async (asesor: Asesor): Promise<Asesor> => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asesor),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el asesor');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo crear el asesor');
    }
  };
  
  // Función para actualizar un asesor
  export const updateAsesor = async (id: number, asesor: Asesor): Promise<Asesor> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(asesor), 
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el asesor');
      }
      return await response.json(); 
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo actualizar el asesor');
    }
  };
  
  // Función para eliminar un asesor
  export const deleteAsesor = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el asesor');
      }
    } catch (error) {
      console.error(error);
      throw new Error('No se pudo eliminar el asesor');
    }
  };
  
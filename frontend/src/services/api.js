const API_BASE_URL = 'http://localhost:5000/api';

// Función helper para manejar respuestas
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Error en la petición');
  }
  return response.json();
};

// SERVICIOS DE USUARIOS
export const userService = {
  // Obtener todos los usuarios
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo usuarios:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  getById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo usuario:', error);
      throw error;
    }
  },

  // Crear nuevo usuario
  create: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando usuario:', error);
      throw error;
    }
  },

  // Actualizar usuario
  update: async (id, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      throw error;
    }
  },

  // Eliminar usuario
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      throw error;
    }
  },
};

// SERVICIOS DE PROYECTOS
export const projectService = {
  // Obtener todos los proyectos
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo proyectos:', error);
      throw error;
    }
  },

  // Crear nuevo proyecto
  create: async (projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando proyecto:', error);
      throw error;
    }
  },

  // Actualizar proyecto
  update: async (id, projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando proyecto:', error);
      throw error;
    }
  },

  // Eliminar proyecto
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
      throw error;
    }
  },
};

// SERVICIOS DE TAREAS
export const taskService = {
  // Obtener todas las tareas
  getAll: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      return await handleResponse(response);
    } catch (error) {
      console.error('Error obteniendo tareas:', error);
      throw error;
    }
  },

  // Crear nueva tarea
  create: async (taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creando tarea:', error);
      throw error;
    }
  },

  // Actualizar tarea
  update: async (id, taskData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      throw error;
    }
  },

  // Eliminar tarea
  delete: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE',
      });
      return await handleResponse(response);
    } catch (error) {
      console.error('Error eliminando tarea:', error);
      throw error;
    }
  },
};

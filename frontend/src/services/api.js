// API Service para comunicación con el backend
const API_BASE_URL = 'http://localhost:5000/api';
const USER_SERVICE_URL = 'http://localhost:3001';
const NOTIFICATION_SERVICE_URL = 'http://localhost:3002';
    
// Helper para manejar respuestas
const handleResponse = async (response) => {   
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};

// Helper para hacer peticiones
const apiRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    return await handleResponse(response);
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};
  
// Adaptadores para convertir campos backend → frontend
const adaptTask = (task) => ({
  ...task,
  title: task.titulo || task.title || 'Sin título',
  description: task.descripcion || task.description || 'Sin descripción',
  status: task.estado || task.status || 'pendiente',
  priority: task.prioridad || task.priority || 'media'
});
    
const adaptProject = (project) => ({
  ...project,
  title: project.nombre || project.name || project.title || 'Sin nombre',
  name: project.nombre || project.name || project.title || 'Sin nombre',
  description: project.descripcion || project.description || 'Sin descripción',
  status: project.estado || project.status || 'planificado'
});

// ===== PROJECTS API =====
export const projectsAPI = {
  getAll: async () => {
    const projects = await apiRequest(`${API_BASE_URL}/projects`);
    return projects.map(adaptProject);
  },
  getById: async (id) => {
    const project = await apiRequest(`${API_BASE_URL}/projects/${id}`);
    return adaptProject(project);
  },
  create: (projectData) => {
    // Convertir campos del frontend al formato del backend
    const backendProjectData = {
      nombre: projectData.name || projectData.nombre || projectData.title,
      descripcion: projectData.description || projectData.descripcion,
      estado: projectData.status || projectData.estado || 'planificado'
    };
    
    return apiRequest(`${API_BASE_URL}/projects`, {
      method: 'POST',
      body: JSON.stringify(backendProjectData),
    });
  },
  update: (id, projectData) => {
    // Convertir campos del frontend al formato del backend
    const backendProjectData = {
      nombre: projectData.name || projectData.nombre || projectData.title,
      descripcion: projectData.description || projectData.descripcion,
      estado: projectData.status || projectData.estado
    };
    
    return apiRequest(`${API_BASE_URL}/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendProjectData),
    });
  },
  delete: (id) => apiRequest(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
  }),
};
  
// ===== TASKS API =====
export const tasksAPI = {
  getAll: async () => {
    const tasks = await apiRequest(`${API_BASE_URL}/tasks`);
    return tasks.map(adaptTask);
  },
  getById: async (id) => {
    const task = await apiRequest(`${API_BASE_URL}/tasks/${id}`);
    return adaptTask(task);
  },
  getByProject: async (projectId) => {
    const tasks = await apiRequest(`${API_BASE_URL}/tasks/project/${projectId}`);
    return tasks.map(adaptTask);
  },
  create: (taskData) => {
    // Convertir campos del frontend al formato del backend
    const backendTaskData = {
      titulo: taskData.title || taskData.titulo,
      descripcion: taskData.description || taskData.descripcion,
      prioridad: taskData.priority || taskData.prioridad,
      proyectoId: taskData.projectId || taskData.proyectoId,
      estado: taskData.status || taskData.estado || 'pendiente'
    };
    
    return apiRequest(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify(backendTaskData),
    });
  },
  update: (id, taskData) => {
    // Convertir campos del frontend al formato del backend
    const backendTaskData = {
      titulo: taskData.title || taskData.titulo,
      descripcion: taskData.description || taskData.descripcion,
      prioridad: taskData.priority || taskData.prioridad,
      proyectoId: taskData.projectId || taskData.proyectoId,
      estado: taskData.status || taskData.estado
    };
    
    return apiRequest(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(backendTaskData),
    });
  },
  delete: (id) => apiRequest(`${API_BASE_URL}/tasks/${id}`, {
    method: 'DELETE',
  }),
};   

// ===== USERS API =====
export const usersAPI = {
  getAll: () => apiRequest(`${USER_SERVICE_URL}/users`),
  getById: (id) => apiRequest(`${USER_SERVICE_URL}/users/${id}`),
  create: (userData) => apiRequest(`${USER_SERVICE_URL}/users`, {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  update: (id, userData) => apiRequest(`${USER_SERVICE_URL}/users/${id}`, {   
    method: 'PUT',
    body: JSON.stringify(userData),
  }),
  delete: (id) => apiRequest(`${USER_SERVICE_URL}/users/${id}`, {
    method: 'DELETE',   
  }),
};
  
// ===== NOTIFICATIONS API =====
export const notificationsAPI = {
  getAll: () => apiRequest(`${NOTIFICATION_SERVICE_URL}/notifications`),
  getByUser: (userId) => apiRequest(`${NOTIFICATION_SERVICE_URL}/notifications/user/${userId}`),
  create: (notificationData) => apiRequest(`${NOTIFICATION_SERVICE_URL}/notifications`, {
    method: 'POST',
    body: JSON.stringify(notificationData),
  }),
  markAsRead: (id) => apiRequest(`${NOTIFICATION_SERVICE_URL}/notifications/${id}/read`, {
    method: 'PUT',
  }),
  delete: (id) => apiRequest(`${NOTIFICATION_SERVICE_URL}/notifications/${id}`, {
    method: 'DELETE',
  }),
};

// ===== HEALTH CHECKS =====
export const healthAPI = {
  backend: () => apiRequest(`${API_BASE_URL}/health`),
  userService: () => apiRequest(`${USER_SERVICE_URL}/health`),
  notificationService: () => apiRequest(`${NOTIFICATION_SERVICE_URL}/health`),
};
     
// Export default con todas las APIs
const api = {
  projects: projectsAPI,
  tasks: tasksAPI,
  users: usersAPI,
  notifications: notificationsAPI,
  health: healthAPI,
};
  
export default api;
    
// Exports con nombres alternativos para compatibilidad
export const projectService = projectsAPI;
export const taskService = tasksAPI;
export const userService = usersAPI;

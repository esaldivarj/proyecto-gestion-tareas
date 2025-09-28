import React, { useState, useEffect } from 'react';
import { taskService, projectService, userService } from '../services/api';

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [filterPriority, setFilterPriority] = useState('Todas');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    project: '',
    assignee: '',
    status: 'Pendiente',
    priority: 'Media',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  // Cargar datos al montar el componente
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, projectsData, usersData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        userService.getAll()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error cargando datos:', error);
      alert('Error cargando datos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (task.project && task.project.name && task.project.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (task.assignee && task.assignee.name && task.assignee.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'Todas' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'Todas' || task.priority === filterPriority;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    } else if (formData.title.length < 3) {
      newErrors.title = 'El título debe tener al menos 3 caracteres';
    }
    
    if (!formData.project) {
      newErrors.project = 'El proyecto es requerido';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'La fecha de vencimiento es requerida';
    } else {
      const today = new Date();
      const dueDate = new Date(formData.dueDate);
      if (dueDate < today) {
        newErrors.dueDate = 'La fecha no puede ser anterior a hoy';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const taskData = {
          title: formData.title,
          description: formData.description,
          projectId: formData.project,
          assignee: formData.assignee || undefined,
          status: formData.status,
          priority: formData.priority,
          dueDate: formData.dueDate
        };
        
        const newTask = await taskService.create(taskData);
        setTasks([...tasks, newTask]);
        setFormData({
          title: '',
          description: '',
          project: '',
          assignee: '',
          status: 'Pendiente',
          priority: 'Media',
          dueDate: ''
        });
        setErrors({});
        setShowForm(false);
        alert('Tarea creada exitosamente');
      } catch (error) {
        console.error('Error creando tarea:', error);
        alert('Error creando tarea: ' + error.message);
      }
    }
  };

  const deleteTask = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      try {
        await taskService.delete(id);
        setTasks(tasks.filter(task => task._id !== id));
        alert('Tarea eliminada exitosamente');
      } catch (error) {
        console.error('Error eliminando tarea:', error);
        alert('Error eliminando tarea: ' + error.message);
      }
    }
  };

  const updateTaskStatus = async (id, newStatus) => {
    try {
      const task = tasks.find(t => t._id === id);
      const updatedTask = await taskService.update(id, {
        ...task,
        status: newStatus
      });
      
      setTasks(tasks.map(t => t._id === id ? updatedTask : t));
    } catch (error) {
      console.error('Error actualizando tarea:', error);
      alert('Error actualizando tarea: ' + error.message);
    }
  };

  if (loading) {
    return (
      <div className="tasks-page">
        <div className="loading">Cargando tareas...</div>
      </div>
    );
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <h2>📋 Gestión de Tareas</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nueva Tarea'}
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar tareas, proyectos o usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="Todas">Todos los Estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Progreso">En Progreso</option>
            <option value="Completada">Completada</option>
          </select>
          
          <select 
            value={filterPriority} 
            onChange={(e) => setFilterPriority(e.target.value)}
            className="filter-select"
          >
            <option value="Todas">Todas las Prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="task-form">
          <h3>Crear Nueva Tarea</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Título de la tarea"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-message">{errors.title}</span>}
              </div>
              
              <div className="form-group">
                <select
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                  className={errors.project ? 'error' : ''}
                >
                  <option value="">Seleccionar Proyecto</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                {errors.project && <span className="error-message">{errors.project}</span>}
              </div>
            </div>

            <div className="form-group">
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="form-row">
              <select
                value={formData.assignee}
                onChange={(e) => setFormData({...formData, assignee: e.target.value})}
              >
                <option value="">Sin asignar</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>

              <div className="form-group">
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                  className={errors.dueDate ? 'error' : ''}
                />
                {errors.dueDate && <span className="error-message">{errors.dueDate}</span>}
              </div>
            </div>

            <div className="form-row">
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>

              <select
                value={formData.priority}
                onChange={(e) => setFormData({...formData, priority: e.target.value})}
              >
                <option value="Alta">Alta Prioridad</option>
                <option value="Media">Media Prioridad</option>
                <option value="Baja">Baja Prioridad</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-success">Crear Tarea</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de tareas */}
      <div className="tasks-summary">
        <p>Mostrando {filteredTasks.length} de {tasks.length} tareas</p>
      </div>

      <div className="tasks-grid">
        {filteredTasks.map(task => (
          <div key={task._id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </div>
            
            <div className="task-info">
              <p><strong>Proyecto:</strong> {task.project ? task.project.name : 'Sin proyecto'}</p>
              <p><strong>Asignado a:</strong> {task.assignee ? task.assignee.name : 'Sin asignar'}</p>
              <p><strong>Descripción:</strong> {task.description || 'Sin descripción'}</p>
              <p><strong>Vencimiento:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}</p>
              <span className={`priority priority-${task.priority.toLowerCase()}`}>
                {task.priority} Prioridad
              </span>
            </div>

            <div className="task-actions">
              <select 
                value={task.status}
                onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                className="status-select"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
              <button className="btn-edit">✏️ Editar</button>
              <button 
                className="btn-delete" 
                onClick={() => deleteTask(task._id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && !loading && (
        <div className="no-data">
          <p>No se encontraron tareas</p>
        </div>
      )}
    </div>
  );
}

export default Tasks;

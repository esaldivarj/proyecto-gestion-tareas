import React, { useState, useEffect } from 'react';

function Tasks() {
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Diseñar UI/UX', project: 'App Móvil', assignee: 'Juan', status: 'Completada', priority: 'Alta', dueDate: '2024-09-25' },
    { id: 2, title: 'Configurar Base de Datos', project: 'Web Dashboard', assignee: 'María', status: 'En Progreso', priority: 'Alta', dueDate: '2024-09-30' },
    { id: 3, title: 'Crear API REST', project: 'API REST', assignee: 'Carlos', status: 'Pendiente', priority: 'Media', dueDate: '2024-10-05' },
    { id: 4, title: 'Testing de Aplicación', project: 'App Móvil', assignee: 'Ana', status: 'Pendiente', priority: 'Baja', dueDate: '2024-10-10' }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [filterPriority, setFilterPriority] = useState('Todas');
  const [formData, setFormData] = useState({
    title: '',
    project: '',
    assignee: '',
    status: 'Pendiente',
    priority: 'Media',
    dueDate: ''
  });
  const [errors, setErrors] = useState({});

  // Filtrar tareas
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.assignee.toLowerCase().includes(searchTerm.toLowerCase());
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
    
    if (!formData.project.trim()) {
      newErrors.project = 'El proyecto es requerido';
    }
    
    if (!formData.assignee.trim()) {
      newErrors.assignee = 'El asignado es requerido';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newTask = {
        id: tasks.length + 1,
        ...formData
      };
      setTasks([...tasks, newTask]);
      setFormData({
        title: '',
        project: '',
        assignee: '',
        status: 'Pendiente',
        priority: 'Media',
        dueDate: ''
      });
      setErrors({});
      setShowForm(false);
    }
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTaskStatus = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  // Auto-complete de proyectos
  const projects = ['App Móvil', 'Web Dashboard', 'API REST', 'Sistema CRM'];
  const users = ['Juan', 'María', 'Carlos', 'Ana', 'Luis', 'Sofia'];

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
                <input
                  type="text"
                  placeholder="Proyecto"
                  value={formData.project}
                  onChange={(e) => setFormData({...formData, project: e.target.value})}
                  list="projects"
                  className={errors.project ? 'error' : ''}
                />
                <datalist id="projects">
                  {projects.map(project => (
                    <option key={project} value={project} />
                  ))}
                </datalist>
                {errors.project && <span className="error-message">{errors.project}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Asignado a"
                  value={formData.assignee}
                  onChange={(e) => setFormData({...formData, assignee: e.target.value})}
                  list="users"
                  className={errors.assignee ? 'error' : ''}
                />
                <datalist id="users">
                  {users.map(user => (
                    <option key={user} value={user} />
                  ))}
                </datalist>
                {errors.assignee && <span className="error-message">{errors.assignee}</span>}
              </div>

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
          <div key={task.id} className="task-card">
            <div className="task-header">
              <h3>{task.title}</h3>
              <span className={`status ${task.status.toLowerCase().replace(' ', '-')}`}>
                {task.status}
              </span>
            </div>
            
            <div className="task-info">
              <p><strong>Proyecto:</strong> {task.project}</p>
              <p><strong>Asignado a:</strong> {task.assignee}</p>
              <p><strong>Vencimiento:</strong> {task.dueDate}</p>
              <span className={`priority priority-${task.priority.toLowerCase()}`}>
                {task.priority} Prioridad
              </span>
            </div>

            <div className="task-actions">
              <select 
                value={task.status}
                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                className="status-select"
              >
                <option value="Pendiente">Pendiente</option>
                <option value="En Progreso">En Progreso</option>
                <option value="Completada">Completada</option>
              </select>
              <button className="btn-edit">✏️ Editar</button>
              <button 
                className="btn-delete" 
                onClick={() => deleteTask(task.id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Tasks;

import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '',
    status: 'Planificado' 
  });
  const [errors, setErrors] = useState({});

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
      alert('Error cargando proyectos: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del proyecto es requerido';
    } else if (formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const newProject = await projectService.create(formData);
        setProjects([...projects, newProject]);
        setFormData({ name: '', description: '', status: 'Planificado' });
        setErrors({});
        setShowForm(false);
        alert('Proyecto creado exitosamente');
      } catch (error) {
        console.error('Error creando proyecto:', error);
        alert('Error creando proyecto: ' + error.message);
      }
    }
  };

  const deleteProject = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este proyecto?')) {
      try {
        await projectService.delete(id);
        setProjects(projects.filter(project => project._id !== id));
        alert('Proyecto eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando proyecto:', error);
        alert('Error eliminando proyecto: ' + error.message);
      }
    }
  };

  if (loading) {
    return (
      <div className="projects-page">
        <div className="loading">Cargando proyectos...</div>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <div className="page-header">
        <h2>🚀 Gestión de Proyectos</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Proyecto'}
        </button>
      </div>

      {showForm && (
        <div className="project-form">
          <h3>Crear Nuevo Proyecto</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input
                type="text"
                placeholder="Nombre del proyecto"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className={errors.name ? 'error' : ''}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Descripción (opcional)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
            
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Planificado">Planificado</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
            
            <div className="form-buttons">
              <button type="submit" className="btn-success">Crear Proyecto</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project._id} className="project-card">
            <div className="project-header">
              <h3>{project.name}</h3>
              <span className={`status ${project.status.toLowerCase().replace(' ', '-')}`}>
                {project.status}
              </span>
            </div>
            
            <div className="project-description">
              <p>{project.description || 'Sin descripción'}</p>
            </div>
            
            <div className="project-stats">
              <div className="stat">
                <span className="stat-number">{project.users ? project.users.length : 0}</span>
                <span className="stat-label">Usuarios</span>
              </div>
              <div className="stat">
                <span className="stat-number">{project.tasks ? project.tasks.length : 0}</span>
                <span className="stat-label">Tareas</span>
              </div>
            </div>
            
            <div className="project-actions">
              <button className="btn-edit">✏️ Editar</button>
              <button 
                className="btn-delete" 
                onClick={() => deleteProject(project._id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div className="no-data">
          <p>No hay proyectos creados</p>
        </div>
      )}
    </div>
  );
}

export default Projects;

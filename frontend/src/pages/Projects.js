import React, { useState, useEffect } from 'react';
import { projectService } from '../services/api';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', status: 'Planificado' });
  const [loading, setLoading] = useState(false);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const loadedProjects = await projectService.getAll();
      setProjects(loadedProjects);
    } catch (error) {
      console.error('Error cargando proyectos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      try {
        setLoading(true);
await projectService.create({
  nombre: formData.name,
  estado: formData.status,
  descripcion: 'Proyecto creado desde frontend'
});        await loadProjects();
        setFormData({ name: '', status: 'Planificado' });
        setShowForm(false);
      } catch (error) {
        console.error('Error creando proyecto:', error);
        alert('Error creando proyecto: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const deleteProject = async (id) => {
    try {
      await projectService.delete(id);
      await loadProjects();
    } catch (error) {
      console.error('Error eliminando proyecto:', error);
    }
  };

  return (
    <div className="projects-container">
      <div className="projects-header">
        <h2>Gestión de Proyectos</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
        >
          {showForm ? 'Cancelar' : 'Nuevo Proyecto'}
        </button>
      </div>

      {loading && <div>Cargando...</div>}

      {showForm && (
        <div className="project-form">
          <h3>Crear Nuevo Proyecto</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <select
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
            >
              <option value="Planificado">Planificado</option>
              <option value="En Progreso">En Progreso</option>
              <option value="Completado">Completado</option>
            </select>
            <button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </button>
          </form>
        </div>
      )}

      <div className="projects-grid">
        {projects.map(project => (
          <div key={project._id || project.id} className="project-card">
            <h3>{project.name || project.nombre}</h3>
            <p>Estado: {project.status || project.estado}</p>
            <button onClick={() => deleteProject(project._id || project.id)}>
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;

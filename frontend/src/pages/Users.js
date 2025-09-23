import React, { useState } from 'react';

function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@ejemplo.com', role: 'Desarrollador', status: 'Activo', projects: ['App Móvil', 'API REST'], tasksCount: 5 },
    { id: 2, name: 'María García', email: 'maria@ejemplo.com', role: 'Project Manager', status: 'Activo', projects: ['Web Dashboard'], tasksCount: 3 },
    { id: 3, name: 'Carlos López', email: 'carlos@ejemplo.com', role: 'Designer', status: 'Inactivo', projects: ['App Móvil'], tasksCount: 2 },
    { id: 4, name: 'Ana Rodríguez', email: 'ana@ejemplo.com', role: 'QA Tester', status: 'Activo', projects: ['Web Dashboard', 'API REST'], tasksCount: 4 }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('Todos');
  const [filterStatus, setFilterStatus] = useState('Todos');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Desarrollador',
    status: 'Activo'
  });
  const [errors, setErrors] = useState({});

  // Filtrar usuarios
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'Todos' || user.role === filterRole;
    const matchesStatus = filterStatus === 'Todos' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Validación del formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }
    
    // Verificar email duplicado
    if (users.some(user => user.email.toLowerCase() === formData.email.toLowerCase())) {
      newErrors.email = 'Este email ya está registrado';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const newUser = {
        id: users.length + 1,
        ...formData,
        projects: [],
        tasksCount: 0
      };
      setUsers([...users, newUser]);
      setFormData({
        name: '',
        email: '',
        role: 'Desarrollador',
        status: 'Activo'
      });
      setErrors({});
      setShowForm(false);
    }
  };

  const deleteUser = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id 
        ? { ...user, status: user.status === 'Activo' ? 'Inactivo' : 'Activo' }
        : user
    ));
  };

  const roles = ['Desarrollador', 'Project Manager', 'Designer', 'QA Tester', 'DevOps'];

  return (
    <div className="users-page">
      <div className="page-header">
        <h2>👥 Gestión de Usuarios</h2>
        <button 
          className="btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancelar' : '+ Nuevo Usuario'}
        </button>
      </div>

      {/* Filtros y búsqueda */}
      <div className="filters-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Buscar usuarios por nombre o email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filters">
          <select 
            value={filterRole} 
            onChange={(e) => setFilterRole(e.target.value)}
            className="filter-select"
          >
            <option value="Todos">Todos los Roles</option>
            {roles.map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
          
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="filter-select"
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>

      {/* Formulario */}
      {showForm && (
        <div className="user-form">
          <h3>Crear Nuevo Usuario</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>

            <div className="form-row">
              <select
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>

              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Activo">Activo</option>
                <option value="Inactivo">Inactivo</option>
              </select>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn-success">Crear Usuario</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Estadísticas rápidas */}
      <div className="users-stats">
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.status === 'Activo').length}</span>
          <span className="stat-label">Usuarios Activos</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{users.filter(u => u.role === 'Desarrollador').length}</span>
          <span className="stat-label">Desarrolladores</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{filteredUsers.length}</span>
          <span className="stat-label">Resultados</span>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="users-grid">
        {filteredUsers.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-header">
              <div className="user-avatar">
                {user.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="user-info">
                <h3>{user.name}</h3>
                <p>{user.email}</p>
                <span className={`user-role role-${user.role.toLowerCase().replace(' ', '-')}`}>
                  {user.role}
                </span>
              </div>
              <span className={`status ${user.status.toLowerCase()}`}>
                {user.status}
              </span>
            </div>

            <div className="user-stats">
              <div className="stat">
                <span className="stat-number">{user.projects.length}</span>
                <span className="stat-label">Proyectos</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.tasksCount}</span>
                <span className="stat-label">Tareas</span>
              </div>
            </div>

            {user.projects.length > 0 && (
              <div className="user-projects">
                <strong>Proyectos:</strong>
                <div className="project-tags">
                  {user.projects.map(project => (
                    <span key={project} className="project-tag">{project}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="user-actions">
              <button 
                className={`btn-toggle ${user.status === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleUserStatus(user.id)}
              >
                {user.status === 'Activo' ? '🔴 Desactivar' : '🟢 Activar'}
              </button>
              <button className="btn-edit">✏️ Editar</button>
              <button 
                className="btn-delete" 
                onClick={() => deleteUser(user.id)}
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

export default Users;

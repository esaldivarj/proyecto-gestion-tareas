import React, { useState, useEffect } from 'react';
import { userService } from '../services/api';

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
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

  // Cargar usuarios al montar el componente
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error cargando usuarios:', error);
      alert('Error cargando usuarios: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      try {
        const newUser = await userService.create(formData);
        setUsers([...users, newUser]);
        setFormData({
          name: '',
          email: '',
          role: 'Desarrollador',
          status: 'Activo'
        });
        setErrors({});
        setShowForm(false);
        alert('Usuario creado exitosamente');
      } catch (error) {
        console.error('Error creando usuario:', error);
        alert('Error creando usuario: ' + error.message);
      }
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      try {
        await userService.delete(id);
        setUsers(users.filter(user => user._id !== id));
        alert('Usuario eliminado exitosamente');
      } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error eliminando usuario: ' + error.message);
      }
    }
  };

  const toggleUserStatus = async (id) => {
    try {
      const user = users.find(u => u._id === id);
      const newStatus = user.status === 'Activo' ? 'Inactivo' : 'Activo';
      
      const updatedUser = await userService.update(id, {
        ...user,
        status: newStatus
      });
      
      setUsers(users.map(u => u._id === id ? updatedUser : u));
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      alert('Error actualizando usuario: ' + error.message);
    }
  };

  const roles = ['Desarrollador', 'Project Manager', 'Designer', 'QA Tester', 'DevOps'];

  if (loading) {
    return (
      <div className="users-page">
        <div className="loading">Cargando usuarios...</div>
      </div>
    );
  }

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
          <div key={user._id} className="user-card">
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
                <span className="stat-number">{user.projects ? user.projects.length : 0}</span>
                <span className="stat-label">Proyectos</span>
              </div>
              <div className="stat">
                <span className="stat-number">0</span>
                <span className="stat-label">Tareas</span>
              </div>
            </div>

            <div className="user-actions">
              <button 
                className={`btn-toggle ${user.status === 'Activo' ? 'active' : 'inactive'}`}
                onClick={() => toggleUserStatus(user._id)}
              >
                {user.status === 'Activo' ? '🔴 Desactivar' : '🟢 Activar'}
              </button>
              <button className="btn-edit">✏️ Editar</button>
              <button 
                className="btn-delete" 
                onClick={() => deleteUser(user._id)}
              >
                🗑️ Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className="no-data">
          <p>No se encontraron usuarios</p>
        </div>
      )}
    </div>
  );
}

export default Users;

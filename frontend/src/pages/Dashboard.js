import React, { useState, useEffect } from 'react';
import { projectService, taskService, userService } from '../services/api';

function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    tasks: 0,
    users: 0,
    completedTasks: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [projects, tasks, users] = await Promise.all([
        projectService.getAll(),
        taskService.getAll(),
        userService.getAll()
      ]);

      // Calcular estadísticas
      const completedTasks = tasks.filter(task => task.status === 'Completada').length;
      const pendingTasks = tasks.filter(task => task.status !== 'Completada').length;
      const activeUsers = users.filter(user => user.status === 'Activo').length;

      setStats({
        projects: projects.length,
        tasks: pendingTasks,
        users: activeUsers,
        completedTasks: completedTasks
      });

      // Generar actividad reciente basada en datos reales
      const activity = [];
      
      // Agregar proyectos recientes
      projects.slice(-2).forEach(project => {
        activity.push(`🆕 Proyecto "${project.name}" creado`);
      });

      // Agregar tareas completadas recientes
      tasks.filter(task => task.status === 'Completada').slice(-2).forEach(task => {
        const assigneeName = task.assignee ? task.assignee.name : 'Usuario';
        activity.push(`✅ Tarea "${task.title}" completada por ${assigneeName}`);
      });

      // Agregar usuarios recientes
      users.slice(-2).forEach(user => {
        activity.push(`👤 Usuario "${user.name}" registrado`);
      });

      setRecentActivity(activity.slice(0, 4));

    } catch (error) {
      console.error('Error cargando dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Cargando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Bienvenido al sistema de gestión de proyectos</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{stats.projects}</h3>
          <p>Proyectos Activos</p>
        </div>
        <div className="stat-card">
          <h3>{stats.tasks}</h3>
          <p>Tareas Pendientes</p>
        </div>
        <div className="stat-card">
          <h3>{stats.users}</h3>
          <p>Usuarios Activos</p>
        </div>
        <div className="stat-card">
          <h3>{stats.completedTasks}</h3>
          <p>Tareas Completadas</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>📈 Actividad Reciente</h3>
        {recentActivity.length > 0 ? (
          <ul>
            {recentActivity.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        ) : (
          <p>No hay actividad reciente</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;

import React from 'react';

function Dashboard() {
  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>📊 Dashboard</h2>
        <p>Bienvenido al sistema de gestión de proyectos</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>5</h3>
          <p>Proyectos Activos</p>
        </div>
        <div className="stat-card">
          <h3>23</h3>
          <p>Tareas Pendientes</p>
        </div>
        <div className="stat-card">
          <h3>8</h3>
          <p>Usuarios</p>
        </div>
        <div className="stat-card">
          <h3>15</h3>
          <p>Tareas Completadas</p>
        </div>
      </div>
      
      <div className="recent-activity">
        <h3>📈 Actividad Reciente</h3>
        <ul>
          <li>✅ Tarea "Diseño UI" completada por Juan</li>
          <li>🆕 Nuevo proyecto "App Móvil" creado</li>
          <li>👤 Usuario "María" asignado al proyecto "Web Dashboard"</li>
          <li>📝 Comentario añadido en "API REST"</li>
        </ul>
      </div>
    </div>
  );
}

export default Dashboard;

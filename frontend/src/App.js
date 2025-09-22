import React, { useState } from 'react';
import './App.css';
import './styles/globals.css';
import './styles/components.css';

// Importar componentes
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Tasks from './pages/Tasks';
import Users from './pages/Users';

function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'projects':
        return <Projects />;
      case 'tasks':
        return <Tasks />;
      case 'users':
        return <Users />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>📋 Gestor de Proyectos</h1>
          </div>
          <div className="nav-menu">
            <button 
              className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dashboard')}
            >
              Dashboard
            </button>
            <button 
              className={`nav-item ${currentPage === 'projects' ? 'active' : ''}`}
              onClick={() => setCurrentPage('projects')}
            >
              Proyectos
            </button>
            <button 
              className={`nav-item ${currentPage === 'tasks' ? 'active' : ''}`}
              onClick={() => setCurrentPage('tasks')}
            >
              Tareas
            </button>
            <button 
              className={`nav-item ${currentPage === 'users' ? 'active' : ''}`}
              onClick={() => setCurrentPage('users')}
            >
              Usuarios
            </button>
          </div>
        </nav>
      </header>
      
      <main className="main-content">
        {renderPage()}
      </main>
      
      <footer className="app-footer">
        <p>&copy; 2024 Sistema de Gestión de Proyectos - Eduardo Esaldivar</p>
      </footer>
    </div>
  );
}

export default App;

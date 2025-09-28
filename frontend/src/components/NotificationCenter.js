import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Conectar a WebSocket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Eventos de conexión
    newSocket.on('connect', () => {
      console.log('Conectado a WebSocket');
      setIsConnected(true);
      // Simular unirse como usuario (en una app real vendría del login)
      newSocket.emit('join-user', 'user123');
    });

    newSocket.on('disconnect', () => {
      console.log('Desconectado de WebSocket');
      setIsConnected(false);
    });

    // Escuchar eventos de proyectos
    newSocket.on('project-created', (data) => {
      addNotification('success', 'Nuevo Proyecto', data.message);
    });

    newSocket.on('project-updated', (data) => {
      addNotification('info', 'Proyecto Actualizado', data.message);
    });

    newSocket.on('project-deleted', (data) => {
      addNotification('warning', 'Proyecto Eliminado', data.message);
    });

    // Escuchar eventos de tareas
    newSocket.on('task-created', (data) => {
      addNotification('success', 'Nueva Tarea', data.message);
    });

    newSocket.on('task-assigned', (data) => {
      addNotification('info', 'Tarea Asignada', data.message);
    });

    newSocket.on('task-updated', (data) => {
      addNotification('info', 'Tarea Actualizada', data.message);
    });

    newSocket.on('task-status-changed', (data) => {
      addNotification('success', 'Estado Cambiado', data.message);
    });

    newSocket.on('task-deleted', (data) => {
      addNotification('warning', 'Tarea Eliminada', data.message);
    });

    // Cleanup al desmontar
    return () => {
      newSocket.close();
    };
  }, []);

  const addNotification = (type, title, message) => {
    const newNotification = {
      id: Date.now(),
      type,
      title,
      message,
      timestamp: new Date(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);

    // Auto-remove después de 5 segundos
    setTimeout(() => {
      removeNotification(newNotification.id);
    }, 5000);
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'error': return '❌';
      default: return '📢';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'success': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div style={{ 
      position: 'fixed', 
      top: '20px', 
      right: '20px', 
      zIndex: 1000,
      maxWidth: '350px'
    }}>
      {/* Indicador de conexión */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px',
        padding: '8px 12px',
        backgroundColor: isConnected ? '#10b981' : '#ef4444',
        color: 'white',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '500'
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: 'white',
          marginRight: '8px',
          animation: isConnected ? 'pulse 2s infinite' : 'none'
        }}></div>
        {isConnected ? 'Conectado en tiempo real' : 'Desconectado'}
      </div>

      {/* Lista de notificaciones */}
      {notifications.map(notification => (
        <div
          key={notification.id}
          style={{
            backgroundColor: 'white',
            border: `2px solid ${getNotificationColor(notification.type)}`,
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            opacity: notification.read ? 0.7 : 1,
            transform: 'translateX(0)',
            transition: 'all 0.3s ease',
            cursor: 'pointer'
          }}
          onClick={() => markAsRead(notification.id)}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start' }}>
            <span style={{ 
              fontSize: '16px', 
              marginRight: '8px',
              marginTop: '2px'
            }}>
              {getNotificationIcon(notification.type)}
            </span>
            <div style={{ flex: 1 }}>
              <div style={{
                fontWeight: '600',
                color: '#1f2937',
                fontSize: '14px',
                marginBottom: '4px'
              }}>
                {notification.title}
              </div>
              <div style={{
                color: '#6b7280',
                fontSize: '12px',
                marginBottom: '6px',
                lineHeight: '1.4'
              }}>
                {notification.message}
              </div>
              <div style={{
                fontSize: '10px',
                color: '#9ca3af'
              }}>
                {notification.timestamp.toLocaleTimeString()}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeNotification(notification.id);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '0',
                marginLeft: '8px'
              }}
            >
              ×
            </button>
          </div>
        </div>
      ))}

      {/* Estilos para animación */}
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `}
      </style>
    </div>
  );
};

export default NotificationCenter;

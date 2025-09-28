const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
  
const app = express();
const server = http.createServer(app);
    
// Configurar Socket.IO con CORS
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});     

const PORT = process.env.PORT || 5000;
  
// Middleware
app.use(cors());
app.use(express.json());
    
// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion_tareas', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    
// Esquemas existentes
const projectSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: String,
  estado: {
    type: String,
    enum: ['planificado', 'en-progreso', 'completado', 'pausado'],
    default: 'planificado'
  },
  fechaCreacion: { type: Date, default: Date.now },
  responsable: String,
  miembros: [String]
});

const taskSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: String,
  proyectoId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
  asignadoA: String,
  prioridad: {
    type: String,
    enum: ['alta', 'media', 'baja'],
    default: 'media'
  },
  estado: {
    type: String,
    enum: ['pendiente', 'en-progreso', 'completada', 'cancelada'],
    default: 'pendiente'
  },
  fechaCreacion: { type: Date, default: Date.now },
  fechaVencimiento: Date
});
  
const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);
    
// Función para enviar notificación a microservicio
const sendNotification = async (titulo, mensaje, tipo, userId) => {
  try {
    const response = await fetch('http://localhost:3002/notifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        titulo,
        mensaje,
        tipo,   
        userId   
      })
    });
    return await response.json();
  } catch (error) {
    console.error('Error enviando notificación:', error);
  }
};

// WebSocket connections
io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
    
  // Usuario se une a una sala específica
  socket.on('join-user', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`Usuario ${userId} se unió a su sala`);
  });
    
  // Manejar desconexión
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});   

// Routes para Projects
app.get('/api/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ fechaCreacion: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    console.log('🚀 DATOS RECIBIDOS EN /api/projects:', req.body);
    console.log('🚀 TIPO DE DATOS:', typeof req.body);
    console.log('🚀 CAMPOS RECIBIDOS:', Object.keys(req.body));
    
    const newProject = new Project(req.body);
    await newProject.save();
  
    console.log('✅ PROYECTO CREADO EXITOSAMENTE:', newProject);

    // Enviar notificación en tiempo real
    io.emit('project-created', {
      project: newProject,
      message: `Nuevo proyecto creado: ${newProject.nombre}`
    });
     
    // Enviar notificación al microservicio
    await sendNotification(
      'Nuevo Proyecto',
      `Se ha creado el proyecto: ${newProject.nombre}`,
      'info',
      newProject.responsable || 'system'
    );

    res.status(201).json(newProject);
  } catch (error) {
    console.error('❌ ERROR CREANDO PROYECTO:', error);
    console.error('❌ MENSAJE DE ERROR:', error.message);
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/projects/:id', async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
  
    if (!updatedProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }
      
    // Notificar cambios en tiempo real
    io.emit('project-updated', {
      project: updatedProject,
      message: `Proyecto actualizado: ${updatedProject.nombre}`
    });
      
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
  
app.delete('/api/projects/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ error: 'Proyecto no encontrado' });
    }

    // Eliminar tareas relacionadas
    await Task.deleteMany({ proyectoId: req.params.id });
      
    // Notificar eliminación
    io.emit('project-deleted', {
      projectId: req.params.id,
      message: `Proyecto eliminado: ${deletedProject.nombre}`
    });
      
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
      
// Routes para Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().populate('proyectoId').sort({ fechaCreacion: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
    
app.get('/api/tasks/project/:projectId', async (req, res) => {
  try {
    const tasks = await Task.find({ proyectoId: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
      
app.post('/api/tasks', async (req, res) => {
  try {
    console.log('🚀 DATOS RECIBIDOS EN /api/tasks:', req.body);
    
    const newTask = new Task(req.body);
    await newTask.save();
    const populatedTask = await Task.findById(newTask._id).populate('proyectoId');
    
    // Enviar notificación en tiempo real
    io.emit('task-created', {
      task: populatedTask,
      message: `Nueva tarea creada: ${newTask.titulo}`
    });
  
    // Notificar al usuario asignado si existe
    if (newTask.asignadoA) {
      io.to(`user_${newTask.asignadoA}`).emit('task-assigned', {
        task: populatedTask,
        message: `Se te ha asignado una nueva tarea: ${newTask.titulo}`
      });

      // Enviar notificación al microservicio
      await sendNotification(
        'Nueva Tarea Asignada',
        `Se te ha asignado la tarea: ${newTask.titulo}`,
        'info',
        newTask.asignadoA
      );
    }
        
    res.status(201).json(populatedTask);
  } catch (error) {
    console.error('❌ ERROR CREANDO TAREA:', error);
    res.status(400).json({ error: error.message });
  }
});
      
app.put('/api/tasks/:id', async (req, res) => {
  try {
    const oldTask = await Task.findById(req.params.id);
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('proyectoId');
     
    if (!updatedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }

    // Notificar cambios en tiempo real
    io.emit('task-updated', {
      task: updatedTask,
      message: `Tarea actualizada: ${updatedTask.titulo}`
    });
        
    // Si cambió el estado, notificar específicamente
    if (oldTask.estado !== updatedTask.estado) {
      io.emit('task-status-changed', {
        task: updatedTask,
        oldStatus: oldTask.estado,
        newStatus: updatedTask.estado,
        message: `Estado de tarea cambiado a: ${updatedTask.estado}`
      });
      
      // Enviar notificación al microservicio
      if (updatedTask.asignadoA) {
        await sendNotification(
          'Estado de Tarea Actualizado',
          `La tarea "${updatedTask.titulo}" cambió a: ${updatedTask.estado}`,
          'success',
          updatedTask.asignadoA
        );
      }
    }
      
    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
      
app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: 'Tarea no encontrada' });
    }
        
    // Notificar eliminación
    io.emit('task-deleted', {
      taskId: req.params.id,
      message: `Tarea eliminada: ${deletedTask.titulo}`
    });
      
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
          
// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend with WebSockets OK',
    timestamp: new Date(),
    connectedClients: io.engine.clientsCount
  });
});
      
// Usar server.listen en lugar de app.listen para WebSockets
server.listen(PORT, () => {
  console.log(`Backend con WebSockets corriendo en puerto ${PORT}`);
});
      
module.exports = { app, server, io };

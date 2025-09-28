const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gestion_tareas_notifications', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Notification Model
const notificationSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  mensaje: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['info', 'success', 'warning', 'error']
  },
  userId: {
    type: String,
    required: true
  },
  leida: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
});

const Notification = mongoose.model('Notification', notificationSchema);

// Routes
app.get('/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ fechaCreacion: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/notifications/user/:userId', async (req, res) => {
  try {
    const notifications = await Notification.find({ 
      userId: req.params.userId 
    }).sort({ fechaCreacion: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/notifications', async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/notifications/:id/read', async (req, res) => {
  try {
    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { leida: true },
      { new: true }
    );
    if (!updatedNotification) {
      return res.status(404).json({ error: 'Notificación no encontrada' });
    }
    res.json(updatedNotification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'Notification Service OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Notification Service corriendo en puerto ${PORT}`);
});

module.exports = app;

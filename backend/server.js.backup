const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
require('dotenv').config();

// Conectar a la base de datos
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ 
    message: 'Servidor backend funcionando correctamente',
    endpoints: {
      projects: '/api/projects',
      tasks: '/api/tasks',
      users: '/api/users'
    }
  });
});

// Rutas API
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

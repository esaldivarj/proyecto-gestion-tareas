const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/users - Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate('projects', 'name status');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/users/:id - Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('projects', 'name status');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/users - Crear nuevo usuario
router.post('/', async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    const user = new User({
      name,
      email,
      role,
      status
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/users/:id - Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { name, email, role, status } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, status },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/users/:id - Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

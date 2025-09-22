const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/projects - Obtener todos los proyectos
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('users', 'name email role')
      .populate('tasks');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/projects/:id - Obtener proyecto por ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('users', 'name email role')
      .populate('tasks');
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/projects - Crear nuevo proyecto
router.post('/', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    const project = new Project({
      name,
      description,
      status
    });

    const savedProject = await project.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/projects/:id - Actualizar proyecto
router.put('/:id', async (req, res) => {
  try {
    const { name, description, status } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { name, description, status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/projects/:id - Eliminar proyecto
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.json({ message: 'Proyecto eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

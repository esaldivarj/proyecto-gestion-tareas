const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');

// GET /api/tasks - Obtener todas las tareas
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('project', 'name status')
      .populate('assignee', 'name email role');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET /api/tasks/:id - Obtener tarea por ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('project', 'name status')
      .populate('assignee', 'name email role');
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const { title, description, status, priority, project, assignee, dueDate } = req.body;
    
    const task = new Task({
      title,
      description,
      status,
      priority,
      project,
      assignee,
      dueDate
    });

    const savedTask = await task.save();
    
    // Añadir tarea al proyecto
    await Project.findByIdAndUpdate(project, {
      $push: { tasks: savedTask._id }
    });

    const populatedTask = await Task.findById(savedTask._id)
      .populate('project', 'name status')
      .populate('assignee', 'name email role');

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const { title, description, status, priority, assignee, dueDate } = req.body;
    
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { title, description, status, priority, assignee, dueDate },
      { new: true }
    ).populate('project', 'name status')
     .populate('assignee', 'name email role');

    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Remover tarea del proyecto
    await Project.findByIdAndUpdate(task.project, {
      $pull: { tasks: task._id }
    });

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

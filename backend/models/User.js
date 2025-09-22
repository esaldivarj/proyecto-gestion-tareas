const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['Desarrollador', 'Project Manager', 'Designer', 'QA Tester', 'DevOps'],
    default: 'Desarrollador'
  },
  status: {
    type: String,
    enum: ['Activo', 'Inactivo'],
    default: 'Activo'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);

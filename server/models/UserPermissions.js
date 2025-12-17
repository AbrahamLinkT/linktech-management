const mongoose = require('mongoose');

const userPermissionsSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee', 'viewer', 'worker'],
    default: 'worker'
  },
  permissions: {
    // Módulos habilitados
    dashboard: { type: Boolean, default: true },
    projects: { type: Boolean, default: false },
    consultants: { type: Boolean, default: false },
    workers: { type: Boolean, default: false },
    client: { type: Boolean, default: false },
    billing: { type: Boolean, default: false },
    metrics: { type: Boolean, default: false },
    cargabilidad: { type: Boolean, default: false },
    proyeccion: { type: Boolean, default: false },
    disponibilidad: { type: Boolean, default: false },
    departamentos: { type: Boolean, default: false },
    usuarios: { type: Boolean, default: false },
    analisis: { type: Boolean, default: false },
    asuetos: { type: Boolean, default: false },
    especialidades: { type: Boolean, default: false },
    esquemaContratacion: { type: Boolean, default: false },
    horasContrato: { type: Boolean, default: false },
    horasPorAprobar: { type: Boolean, default: false },
    solicitudHoras: { type: Boolean, default: false },
    
    // Permisos específicos
    canCreate: { type: Boolean, default: false },
    canEdit: { type: Boolean, default: false },
    canDelete: { type: Boolean, default: false },
    canExport: { type: Boolean, default: false }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Middleware para actualizar updatedAt
userPermissionsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('UserPermissions', userPermissionsSchema);

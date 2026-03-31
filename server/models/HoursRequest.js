const mongoose = require('mongoose');

const hoursRequestSchema = new mongoose.Schema({
  // IDs y referencias del proyecto
  project_id: {
    type: String,
    required: true
  },
  project_name: {
    type: String,
    required: true
  },
  project_code: {
    type: String,
    required: true
  },
  
  // Información del consultor que solicita horas
  worker_id: {
    type: String,
    required: true
  },
  worker_name: {
    type: String,
    required: true
  },
  worker_email: {
    type: String,
    required: true
  },
  
  // Información del departamento del consultor
  worker_department_id: {
    type: String,
    required: true
  },
  worker_department_name: {
    type: String,
    required: true
  },
  
  // Información del líder del departamento (quien aprueba)
  department_head_id: {
    type: String,
    required: true
  },
  department_head_name: {
    type: String,
    required: true
  },
  department_head_email: {
    type: String,
    required: true
  },
  
  // Información de quién solicitó las horas
  requested_by_id: {
    type: String,
    required: true
  },
  requested_by_name: {
    type: String,
    required: true
  },
  requested_by_email: {
    type: String,
    required: true
  },
  
  // Detalles de horas solicitadas
  requested_hours: {
    type: Number,
    required: true,
    min: 0.5,
    max: 40
  },
  
  // Motivo de la solicitud
  reason: {
    type: String,
    required: true
  },
  
  // Fechas de la solicitud
  start_date: {
    type: String, // ISO format: YYYY-MM-DD
    required: true
  },
  end_date: {
    type: String, // ISO format: YYYY-MM-DD
    required: true
  },
  
  // Estado de la solicitud
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  
  // Respuesta del líder del departamento
  approved_by: {
    type: String, // ID del usuario que aprobó
    default: null
  },
  approved_at: {
    type: Date,
    default: null
  },
  
  // Información de rechazo
  rejection_reason: {
    type: String,
    default: null
  },
  rejected_at: {
    type: Date,
    default: null
  },
  
  // Datos de la asignación original (para reproducir si es necesario)
  assignment_data: {
    type: Object,
    default: {}
  },
  
  // Timestamps
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Índices para búsquedas frecuentes
hoursRequestSchema.index({ status: 1, department_head_email: 1 });
hoursRequestSchema.index({ project_id: 1, worker_id: 1 });
hoursRequestSchema.index({ created_at: -1 });

module.exports = mongoose.model('HoursRequest', hoursRequestSchema);

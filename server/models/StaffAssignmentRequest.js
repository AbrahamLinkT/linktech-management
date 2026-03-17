const mongoose = require('mongoose');

const staffAssignmentRequestSchema = new mongoose.Schema({
  // IDs y referencias
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
  
  // Información del consultor a asignar
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
  
  // Información de quién solicitó la asignación
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
  rejection_reason: {
    type: String,
    default: null
  },
  rejected_at: {
    type: Date,
    default: null
  },
  
  // Datos de asignación
  assignment_data: {
    // Se guardará el payload completo para reproducir la asignación si es aprobada
    type: Object,
    default: {}
  },
  
  // Auditoría
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Índices para búsquedas rápidas
staffAssignmentRequestSchema.index({ status: 1, department_head_email: 1 });
staffAssignmentRequestSchema.index({ project_id: 1, worker_id: 1 });
staffAssignmentRequestSchema.index({ department_head_email: 1 });
staffAssignmentRequestSchema.index({ created_at: -1 });

module.exports = mongoose.model('StaffAssignmentRequest', staffAssignmentRequestSchema);

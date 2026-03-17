const express = require('express');
const router = express.Router();
const StaffAssignmentRequest = require('../models/StaffAssignmentRequest');

// Crear nueva solicitud de asignación
router.post('/create', async (req, res) => {
  try {
    const {
      project_id,
      project_name,
      project_code,
      worker_id,
      worker_name,
      worker_email,
      worker_department_id,
      worker_department_name,
      department_head_id,
      department_head_name,
      department_head_email,
      requested_by_id,
      requested_by_name,
      requested_by_email,
      assignment_data
    } = req.body;

    // Validar campos requeridos
    if (!project_id || !worker_id || !department_head_email) {
      return res.status(400).json({
        error: 'Faltan campos requeridos: project_id, worker_id, department_head_email'
      });
    }

    // Crear nueva solicitud
    const newRequest = new StaffAssignmentRequest({
      project_id,
      project_name,
      project_code,
      worker_id,
      worker_name,
      worker_email,
      worker_department_id,
      worker_department_name,
      department_head_id,
      department_head_name,
      department_head_email,
      requested_by_id,
      requested_by_name,
      requested_by_email,
      assignment_data: assignment_data || {},
      status: 'pending'
    });

    await newRequest.save();

    res.json({
      success: true,
      message: 'Solicitud de asignación creada exitosamente',
      request: newRequest
    });
  } catch (error) {
    console.error('Error creando solicitud de asignación:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener solicitudes pendientes para un líder de departamento
router.get('/pending/:departmentHeadEmail', async (req, res) => {
  try {
    const { departmentHeadEmail } = req.params;

    const requests = await StaffAssignmentRequest.find({
      department_head_email: departmentHeadEmail.toLowerCase(),
      status: 'pending'
    }).sort({ created_at: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes pendientes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener solicitudes por proyecto
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const requests = await StaffAssignmentRequest.find({
      project_id: projectId
    }).sort({ created_at: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes del proyecto:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todas las solicitudes de un consultor
router.get('/worker/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    const requests = await StaffAssignmentRequest.find({
      worker_id: workerId
    }).sort({ created_at: -1 });

    res.json({
      success: true,
      count: requests.length,
      requests
    });
  } catch (error) {
    console.error('Error obteniendo solicitudes del consultor:', error);
    res.status(500).json({ error: error.message });
  }
});

// Aprobar solicitud de asignación Y crear la asignación en assigned_hours
router.put('/approve-and-assign/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approved_by } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: 'ID de solicitud requerido' });
    }

    const request = await StaffAssignmentRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    // Actualizar estado de la solicitud
    request.status = 'approved';
    request.approved_by = approved_by;
    request.approved_at = new Date();
    request.updated_at = new Date();
    await request.save();

    // TODO: Aquí iría el código para crear la asignación en assigned_hours
    // Esto se puede hacer directamente en el frontend haciendo un POST al endpoint de assigned_hours
    // O puedes hacer un POST aquí que envíe los datos al backend Java

    res.json({
      success: true,
      message: 'Solicitud aprobada. Procede a asignar el consultor.',
      request
    });
  } catch (error) {
    console.error('Error aprobando solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

// Aprobar solicitud de asignación
router.put('/approve/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approved_by } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: 'ID de solicitud requerido' });
    }

    const request = await StaffAssignmentRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'approved',
        approved_by,
        approved_at: new Date(),
        updated_at: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      success: true,
      message: 'Solicitud aprobada exitosamente',
      request
    });
  } catch (error) {
    console.error('Error aprobando solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rechazar solicitud de asignación
router.put('/reject/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;
    const { approved_by, rejection_reason } = req.body;

    if (!requestId) {
      return res.status(400).json({ error: 'ID de solicitud requerido' });
    }

    const request = await StaffAssignmentRequest.findByIdAndUpdate(
      requestId,
      {
        status: 'rejected',
        approved_by,
        rejection_reason: rejection_reason || 'Sin especificar',
        rejected_at: new Date(),
        updated_at: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      success: true,
      message: 'Solicitud rechazada',
      request
    });
  } catch (error) {
    console.error('Error rechazando solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener una solicitud específica
router.get('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await StaffAssignmentRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    res.json({
      success: true,
      request
    });
  } catch (error) {
    console.error('Error obteniendo solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

// Eliminar solicitud (solo si está pendiente)
router.delete('/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await StaffAssignmentRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({ error: 'Solicitud no encontrada' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ error: 'No se puede eliminar una solicitud que ya ha sido procesada' });
    }

    await StaffAssignmentRequest.findByIdAndDelete(requestId);

    res.json({
      success: true,
      message: 'Solicitud eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando solicitud:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

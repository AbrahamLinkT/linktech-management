const express = require('express');
const router = express.Router();
const HoursRequest = require('../models/HoursRequest');

/**
 * POST /create
 * Crear una nueva solicitud de horas
 */
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
      requested_hours,
      reason,
      start_date,
      end_date,
      assignment_data
    } = req.body;

    // Validar campos requeridos
    if (
      !project_id ||
      !worker_id ||
      !worker_name ||
      !department_head_email ||
      !requested_by_email ||
      !requested_hours ||
      !reason ||
      !start_date ||
      !end_date
    ) {
      return res.status(400).json({
        error: 'Missing required fields'
      });
    }

    const hoursRequest = new HoursRequest({
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
      requested_hours,
      reason,
      start_date,
      end_date,
      status: 'pending',
      assignment_data: assignment_data || {},
      created_at: new Date(),
      updated_at: new Date()
    });

    const savedRequest = await hoursRequest.save();

    res.status(201).json({
      success: true,
      message: 'Hours request created successfully',
      data: savedRequest
    });
  } catch (error) {
    console.error('Error creating hours request:', error);
    res.status(500).json({
      error: 'Failed to create hours request',
      details: error.message
    });
  }
});

/**
 * GET /pending/:email
 * Obtener solicitudes pendientes para un líder de departamento
 */
router.get('/pending/:email', async (req, res) => {
  try {
    const { email } = req.params;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const requests = await HoursRequest.find({
      department_head_email: email.toLowerCase(),
      status: 'pending'
    }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching pending requests:', error);
    res.status(500).json({
      error: 'Failed to fetch pending requests',
      details: error.message
    });
  }
});

/**
 * GET /project/:projectId
 * Obtener todas las solicitudes de horas de un proyecto
 */
router.get('/project/:projectId', async (req, res) => {
  try {
    const { projectId } = req.params;

    const requests = await HoursRequest.find({
      project_id: projectId
    }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching project requests:', error);
    res.status(500).json({
      error: 'Failed to fetch project requests',
      details: error.message
    });
  }
});

/**
 * GET /worker/:workerId
 * Obtener todas las solicitudes de horas de un consultor
 */
router.get('/worker/:workerId', async (req, res) => {
  try {
    const { workerId } = req.params;

    const requests = await HoursRequest.find({
      worker_id: workerId
    }).sort({ created_at: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Error fetching worker requests:', error);
    res.status(500).json({
      error: 'Failed to fetch worker requests',
      details: error.message
    });
  }
});

/**
 * GET /:id
 * Obtener una solicitud específica
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const request = await HoursRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      data: request
    });
  } catch (error) {
    console.error('Error fetching request:', error);
    res.status(500).json({
      error: 'Failed to fetch request',
      details: error.message
    });
  }
});

/**
 * PUT /approve/:id
 * Aprobar una solicitud de horas
 */
router.put('/approve/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by } = req.body;

    if (!approved_by) {
      return res.status(400).json({ error: 'approved_by is required' });
    }

    const request = await HoursRequest.findByIdAndUpdate(
      id,
      {
        status: 'approved',
        approved_by,
        approved_at: new Date(),
        updated_at: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Hours request approved successfully',
      data: request
    });
  } catch (error) {
    console.error('Error approving request:', error);
    res.status(500).json({
      error: 'Failed to approve request',
      details: error.message
    });
  }
});

/**
 * PUT /reject/:id
 * Rechazar una solicitud de horas
 */
router.put('/reject/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { approved_by, rejection_reason } = req.body;

    if (!approved_by) {
      return res.status(400).json({ error: 'approved_by is required' });
    }

    const request = await HoursRequest.findByIdAndUpdate(
      id,
      {
        status: 'rejected',
        approved_by, // registra quién rechazó
        rejection_reason: rejection_reason || 'No reason provided',
        rejected_at: new Date(),
        updated_at: new Date()
      },
      { new: true }
    );

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Hours request rejected successfully',
      data: request
    });
  } catch (error) {
    console.error('Error rejecting request:', error);
    res.status(500).json({
      error: 'Failed to reject request',
      details: error.message
    });
  }
});

/**
 * DELETE /:id
 * Eliminar una solicitud (solo si está en estado pending)
 */
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const request = await HoursRequest.findById(id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        error: 'Can only delete pending requests'
      });
    }

    await HoursRequest.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Hours request deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({
      error: 'Failed to delete request',
      details: error.message
    });
  }
});

module.exports = router;

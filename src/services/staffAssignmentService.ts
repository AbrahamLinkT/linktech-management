/**
 * Servicio para manejar solicitudes de asignación de consultores
 * Usa el proxy de Next.js en /api/staff-assignment-requests
 */

const API_BASE = '/api/staff-assignment-requests';

export interface CreateAssignmentRequestParams {
  project_id: string;
  project_name: string;
  project_code: string;
  worker_id: string;
  worker_name: string;
  worker_email: string;
  worker_department_id: string;
  worker_department_name: string;
  department_head_id: string;
  department_head_name: string;
  department_head_email: string;
  requested_by_id: string;
  requested_by_name: string;
  requested_by_email: string;
  assignment_data?: Record<string, any>;
}

export interface StaffAssignmentRequest {
  _id: string;
  project_id: string;
  project_name: string;
  project_code: string;
  worker_id: string;
  worker_name: string;
  worker_email: string;
  worker_department_id: string;
  worker_department_name: string;
  department_head_id: string;
  department_head_name: string;
  department_head_email: string;
  requested_by_id: string;
  requested_by_name: string;
  requested_by_email: string;
  status: 'pending' | 'approved' | 'rejected';
  approved_by?: string;
  approved_at?: string;
  rejection_reason?: string;
  rejected_at?: string;
  assignment_data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

/**
 * Crear nueva solicitud de asignación
 */
export async function createAssignmentRequest(params: CreateAssignmentRequestParams) {
  const response = await fetch(`${API_BASE}/api/staff-assignment-requests/create`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error creando solicitud de asignación');
  }

  return response.json();
}

/**
 * Obtener solicitudes pendientes para un líder de departamento
 */
export async function getPendingRequests(departmentHeadEmail: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/pending/${encodeURIComponent(departmentHeadEmail)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitudes pendientes');
  }

  return response.json();
}

/**
 * Obtener solicitudes de un proyecto
 */
export async function getProjectRequests(projectId: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/project/${projectId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitudes del proyecto');
  }

  return response.json();
}

/**
 * Obtener solicitudes de un consultor
 */
export async function getWorkerRequests(workerId: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/worker/${workerId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitudes del consultor');
  }

  return response.json();
}

/**
 * Obtener una solicitud específica
 */
export async function getRequest(requestId: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/${requestId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitud');
  }

  return response.json();
}

/**
 * Aprobar solicitud de asignación
 */
export async function approveRequest(requestId: string, approvedBy: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/approve/${requestId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: approvedBy })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error aprobando solicitud');
  }

  return response.json();
}

/**
 * Aprobar solicitud de asignación y crear la asignación
 */
export async function approveAndAssignRequest(requestId: string, approvedBy: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/approve-and-assign/${requestId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: approvedBy })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error aprobando solicitud');
  }

  return response.json();
}

/**
 * Rechazar solicitud de asignación
 */
export async function rejectRequest(
  requestId: string,
  approvedBy: string,
  rejectionReason?: string
) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/reject/${requestId}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        approved_by: approvedBy,
        rejection_reason: rejectionReason
      })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error rechazando solicitud');
  }

  return response.json();
}

/**
 * Eliminar solicitud (solo si está pendiente)
 */
export async function deleteRequest(requestId: string) {
  const response = await fetch(
    `${API_BASE}/api/staff-assignment-requests/${requestId}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error eliminando solicitud');
  }

  return response.json();
}

/**
 * Servicio para manejar solicitudes de horas de otros departamentos
 * Usa los API routes de Next.js como proxy
 */

export interface CreateHoursRequestParams {
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
  requested_hours: number;
  reason: string;
  start_date: string;
  end_date: string;
  assignment_data?: Record<string, any>;
}

export interface HoursRequest {
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
  requested_hours: number;
  reason: string;
  start_date: string;
  end_date: string;
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
 * Crear nueva solicitud de horas
 */
export async function createHoursRequest(params: CreateHoursRequestParams) {
  const response = await fetch('/api/hours-requests/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error creando solicitud de horas');
  }

  return response.json();
}

/**
 * Obtener solicitudes pendientes para un líder de departamento
 */
export async function getPendingHoursRequests(departmentHeadEmail: string) {
  const response = await fetch(
    `/api/hours-requests/pending?email=${encodeURIComponent(departmentHeadEmail)}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitudes pendientes de horas');
  }

  return response.json();
}

/**
 * Obtener solicitudes de horas de un proyecto
 */
export async function getProjectHoursRequests(projectId: string) {
  const response = await fetch(
    `/api/hours-requests/project?id=${projectId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitudes del proyecto');
  }

  return response.json();
}

/**
 * Obtener solicitudes de horas de un consultor
 */
export async function getWorkerHoursRequests(workerId: string) {
  const response = await fetch(
    `/api/hours-requests/worker?id=${workerId}`
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
export async function getHoursRequest(requestId: string) {
  const response = await fetch(
    `/api/hours-requests/get?id=${requestId}`
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error obteniendo solicitud');
  }

  return response.json();
}

/**
 * Aprobar solicitud de horas
 */
export async function approveHoursRequest(requestId: string, approvedBy: string) {
  const response = await fetch(
    `/api/hours-requests/action?id=${requestId}&action=approve`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ approved_by: approvedBy })
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error aprobando solicitud de horas');
  }

  return response.json();
}

/**
 * Rechazar solicitud de horas
 */
export async function rejectHoursRequest(
  requestId: string,
  approvedBy: string,
  rejectionReason?: string
) {
  const response = await fetch(
    `/api/hours-requests/action?id=${requestId}&action=reject`,
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
    throw new Error(errorData.error || 'Error rechazando solicitud de horas');
  }

  return response.json();
}

/**
 * Eliminar solicitud de horas (solo si está pendiente)
 */
export async function deleteHoursRequest(requestId: string) {
  const response = await fetch(
    `/api/hours-requests/delete?id=${requestId}`,
    { method: 'DELETE' }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Error eliminando solicitud');
  }

  return response.json();
}

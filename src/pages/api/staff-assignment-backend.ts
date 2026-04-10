import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linktech-management-a.vercel.app';

const getSingleQueryValue = (value: string | string[] | undefined) => {
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, query } = req;
  const action = getSingleQueryValue(query.action);
  const email = getSingleQueryValue(query.email);
  const projectId = getSingleQueryValue(query.projectId);
  const id = getSingleQueryValue(query.id);

  try {
    let endpoint = '';

    switch (method) {
      case 'GET':
        if (action === 'pending' && email) {
          endpoint = `${BACKEND_URL}/api/staff-assignment-requests/pending/${encodeURIComponent(email)}`;
          break;
        }

        if (action === 'project' && projectId) {
          endpoint = `${BACKEND_URL}/api/staff-assignment-requests/project/${encodeURIComponent(projectId)}`;
          break;
        }

        return res.status(400).json({ error: 'Invalid query parameters' });

      case 'POST':
        if (action === 'create') {
          endpoint = `${BACKEND_URL}/api/staff-assignment-requests/create`;
          break;
        }

        return res.status(400).json({ error: 'Invalid action' });

      case 'PUT':
        if (action === 'approve' && id) {
          endpoint = `${BACKEND_URL}/api/staff-assignment-requests/approve/${encodeURIComponent(id)}`;
          break;
        }

        if (action === 'reject' && id) {
          endpoint = `${BACKEND_URL}/api/staff-assignment-requests/reject/${encodeURIComponent(id)}`;
          break;
        }

        return res.status(400).json({ error: 'Invalid action' });

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const response = await fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: method === 'GET' ? undefined : JSON.stringify(req.body)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (error: any) {
    console.error('❌ API Error en /api/staff-assignment-backend:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

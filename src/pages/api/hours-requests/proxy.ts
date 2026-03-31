import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linktech-management-a.vercel.app';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { path, email, id, action } = req.query;

  try {
    let url = `${BACKEND_URL}/api/hours-requests`;

    if (path === 'create' && req.method === 'POST') {
      url = `${BACKEND_URL}/api/hours-requests/create`;
    } else if (path === 'pending' && email) {
      url = `${BACKEND_URL}/api/hours-requests/pending/${email}`;
    } else if (path === 'project' && id) {
      url = `${BACKEND_URL}/api/hours-requests/project/${id}`;
    } else if (path === 'worker' && id) {
      url = `${BACKEND_URL}/api/hours-requests/worker/${id}`;
    } else if (path === 'get' && id) {
      url = `${BACKEND_URL}/api/hours-requests/${id}`;
    } else if (path === 'action' && id && action === 'approve') {
      url = `${BACKEND_URL}/api/hours-requests/approve/${id}`;
    } else if (path === 'action' && id && action === 'reject') {
      url = `${BACKEND_URL}/api/hours-requests/reject/${id}`;
    } else if (path === 'delete' && id) {
      url = `${BACKEND_URL}/api/hours-requests/${id}`;
    }

    const response = await fetch(url, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(response.status).json(data);
  } catch (error: any) {
    console.error('Error calling hours-requests API:', error);
    res.status(500).json({
      error: 'Failed to call hours-requests API',
      details: error.message,
    });
  }
}

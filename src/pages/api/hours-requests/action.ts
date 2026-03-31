import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linktech-management-a.vercel.app';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id, action } = req.query;

  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!id || !action) {
    return res.status(400).json({ error: 'ID and action are required' });
  }

  try {
    const endpoint =
      action === 'approve'
        ? `${BACKEND_URL}/api/hours-requests/approve/${id}`
        : `${BACKEND_URL}/api/hours-requests/reject/${id}`;

    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error(`Error ${action} hours request:`, error);
    res.status(500).json({
      error: `Failed to ${action} hours request`,
      details: error.message,
    });
  }
}

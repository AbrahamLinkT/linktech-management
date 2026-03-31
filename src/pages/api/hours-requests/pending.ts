import type { NextApiRequest, NextApiResponse } from 'next';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://linktech-management-a.vercel.app';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { email } = req.query;

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const response = await fetch(
      `${BACKEND_URL}/api/hours-requests/pending/${email}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.status(200).json(data);
  } catch (error: any) {
    console.error('Error fetching pending hours requests:', error);
    res.status(500).json({
      error: 'Failed to fetch pending hours requests',
      details: error.message,
    });
  }
}

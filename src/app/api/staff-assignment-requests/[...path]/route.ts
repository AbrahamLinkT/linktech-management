/**
 * Proxy para solicitudes de asignación de consultores
 * Actúa como intermediario entre frontend y backend Node.js
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = new URL(request.url);
  const queryString = url.search;
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/staff-assignment-requests/${path}${queryString}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch from backend' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const body = await request.json();

  try {
    const response = await fetch(`${BACKEND_URL}/api/staff-assignment-requests/${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to create assignment request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const body = await request.json();
  const url = new URL(request.url);
  const queryString = url.search;

  try {
    const response = await fetch(`${BACKEND_URL}/api/staff-assignment-requests/${path}${queryString}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to update assignment request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  const path = params.path?.join('/') || '';
  const url = new URL(request.url);
  const queryString = url.search;

  try {
    const response = await fetch(`${BACKEND_URL}/api/staff-assignment-requests/${path}${queryString}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to delete assignment request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

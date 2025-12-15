import { UserPermissionsResponse } from '@/types/permissions';

const PERMISSIONS_API_URL = 'https://linktech-ma-server-db.vercel.app/api/permissions';

export async function getUserPermissions(email: string): Promise<UserPermissionsResponse | null> {
  try {
    const response = await fetch(`${PERMISSIONS_API_URL}?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch permissions:', response.status);
      return null;
    }

    const data: UserPermissionsResponse = await response.json();
    
    if (!data.success || !data.isActive) {
      console.warn('User not active or permissions fetch failed:', email);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return null;
  }
}

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

export async function createUserPermissions(email: string, name: string): Promise<UserPermissionsResponse | null> {
  try {
    const newUser = {
      email,
      name,
      role: 'worker',
      permissions: {
        dashboard: false,
        projects: false,
        consultants: false,
        workers: false,
        client: false,
        billing: false,
        metrics: false,
        cargabilidad: false,
        proyeccion: false,
        disponibilidad: false,
        departamentos: false,
        usuarios: false,
        analisis: false,
        asuetos: false,
        especialidades: false,
        esquemaContratacion: false,
        horasContrato: false,
        horasPorAprobar: false,
        solicitudHoras: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
        canExport: false,
      },
      isActive: true,
    };

    const response = await fetch(PERMISSIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      console.error('Failed to create user permissions:', response.status);
      return null;
    }

    const data: UserPermissionsResponse = await response.json();
    
    if (!data.success) {
      console.error('User creation failed:', data);
      return null;
    }

    console.log('✅ Usuario creado exitosamente:', email);
    return data;
  } catch (error) {
    console.error('Error creating user permissions:', error);
    return null;
  }
}

export async function verifyOrCreateUser(email: string, name: string): Promise<UserPermissionsResponse | null> {
  try {
    console.log('🔍 Verificando usuario:', email);
    
    // Intentar obtener permisos existentes
    const existingPermissions = await getUserPermissions(email);
    
    if (existingPermissions) {
      console.log('✅ Usuario existente encontrado:', email);
      return existingPermissions;
    }

    // Si no existe, crear nuevo usuario
    console.log('➕ Usuario no encontrado, creando nuevo:', email);
    const newPermissions = await createUserPermissions(email, name);
    
    return newPermissions;
  } catch (error) {
    console.error('Error in verifyOrCreateUser:', error);
    return null;
  }
}

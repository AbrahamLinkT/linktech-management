'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { UserPermissionsResponse } from '@/types/permissions';

interface PermissionsContextType {
  permissions: UserPermissionsResponse | null;
  loading: boolean;
  hasPermission: (module: string) => boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canExport: boolean;
  role: string;
}

const PermissionsContext = createContext<PermissionsContextType>({
  permissions: null,
  loading: true,
  hasPermission: () => false,
  canCreate: false,
  canEdit: false,
  canDelete: false,
  canExport: false,
  role: 'viewer',
});

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [permissions, setPermissions] = useState<UserPermissionsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPermissions() {
      if (!isLoaded || !user) {
        setLoading(false);
        return;
      }

      // Extraer email y nombre desde Clerk
      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.fullName || user.firstName || email?.split('@')[0] || 'Usuario';
      
      if (!email) {
        console.error('❌ No se pudo obtener el email del usuario de Clerk');
        setLoading(false);
        return;
      }

      try {
        console.log('🔐 Usuario autenticado con Clerk');
        console.log('📧 Email:', email);
        console.log('👤 Nombre:', name);
        console.log('🔍 Verificando existencia en MongoDB...');
        
        // Paso 1: Verificar si el usuario existe en MongoDB
        const checkResponse = await fetch(
          `https://linktech-ma-server-db.vercel.app/api/permissions?email=${encodeURIComponent(email)}`
        );

        if (checkResponse.ok) {
          // Usuario encontrado
          const userData = await checkResponse.json();
          if (userData.success && userData.isActive) {
            console.log('✅ Usuario existente encontrado en MongoDB');
            console.log('🔑 Permisos cargados:', Object.keys(userData.permissions).filter(k => userData.permissions[k]).join(', ') || 'ninguno');
            setPermissions(userData);
          } else if (!userData.isActive) {
            console.warn('⚠️ Usuario inactivo');
            setPermissions(null);
          }
        } else if (checkResponse.status === 404) {
          // Usuario NO encontrado - Crear nuevo
          console.log('❌ Usuario no encontrado en MongoDB');
          console.log('➕ Creando nuevo usuario con permisos por defecto...');
          
          const newUserData = {
            email,
            name,
            role: 'worker' as const,
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

          console.log('📤 Enviando datos a MongoDB:', { email, name, role: 'worker' });

          // Paso 2: Crear nuevo usuario en MongoDB
          const createResponse = await fetch(
            'https://linktech-ma-server-db.vercel.app/api/permissions',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newUserData),
            }
          );

          if (createResponse.ok) {
            const createdData = await createResponse.json();
            if (createdData.success) {
              console.log('✅ Usuario creado exitosamente en MongoDB');
              console.log('🔒 Permisos iniciales: Todos en FALSE (requiere autorización de administrador)');
              
              // Configurar permisos en el estado (todos en false)
              setPermissions({
                success: true,
                email: newUserData.email,
                name: newUserData.name,
                role: newUserData.role,
                permissions: newUserData.permissions,
                isActive: true,
              });
            } else {
              console.error('❌ Error: La creación no fue exitosa', createdData);
            }
          } else {
            const errorData = await createResponse.json();
            console.error('❌ Error al crear usuario en MongoDB:', createResponse.status, errorData);
          }
        } else {
          console.error('❌ Error inesperado al verificar usuario:', checkResponse.status);
        }
      } catch (error) {
        console.error('❌ Error en verificación/creación de permisos:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPermissions();
  }, [isLoaded, user]);

  const hasPermission = (module: string): boolean => {
    if (!permissions) return false;
    return permissions.permissions[module as keyof typeof permissions.permissions] === true;
  };

  return (
    <PermissionsContext.Provider
      value={{
        permissions,
        loading,
        hasPermission,
        canCreate: permissions?.permissions.canCreate || false,
        canEdit: permissions?.permissions.canEdit || false,
        canDelete: permissions?.permissions.canDelete || false,
        canExport: permissions?.permissions.canExport || false,
        role: permissions?.role || 'viewer',
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
}

export function usePermissions() {
  const context = useContext(PermissionsContext);
  if (context === undefined) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
}

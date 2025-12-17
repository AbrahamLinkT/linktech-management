"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Componente que verifica/crea el usuario en MongoDB después del login
 * y redirige al dashboard
 */
export function AuthCallbackHandler() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    async function handleAuthCallback() {
      // Esperar a que Clerk cargue
      if (!isLoaded) return;

      // Si no está autenticado, no hacer nada
      if (!isSignedIn || !user) return;

      // Si ya estamos procesando, no hacer nada
      if (isProcessing) return;

      setIsProcessing(true);

      try {
        const email = user.primaryEmailAddress?.emailAddress;
        const name = user.fullName || user.firstName || email?.split('@')[0] || 'Usuario';

        if (!email) {
          console.error('❌ No se pudo obtener el email del usuario');
          setIsProcessing(false);
          return;
        }

        console.log('🔐 Usuario autenticado, procesando callback...');
        console.log('📧 Email:', email);
        console.log('👤 Nombre:', name);

        // Paso 1: Verificar si existe en MongoDB
        console.log('🔍 Verificando en MongoDB...');
        const checkResponse = await fetch(
          `https://linktech-management-a.vercel.app/api/permissions?email=${encodeURIComponent(email)}`
        );

        if (checkResponse.ok) {
          // Usuario existe
          console.log('✅ Usuario encontrado en MongoDB');
          const userData = await checkResponse.json();
          
          if (userData.success && userData.isActive) {
            console.log('✅ Usuario activo, redirigiendo al dashboard...');
            router.push('/dashboard');
          } else {
            console.warn('⚠️ Usuario inactivo');
          }
        } else if (checkResponse.status === 404) {
          // Usuario NO existe - Crear
          console.log('❌ Usuario no encontrado, creando...');
          
          const newUserData = {
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

          const createResponse = await fetch(
            'https://linktech-management-a.vercel.app/api/permissions',
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
              console.log('✅ Usuario creado exitosamente');
              console.log('🔒 Permisos iniciales: Todos en FALSE');
              console.log('➡️ Redirigiendo al dashboard...');
              router.push('/dashboard');
            } else {
              console.error('❌ Error al crear usuario:', createdData);
            }
          } else {
            console.error('❌ Error en petición de creación:', createResponse.status);
          }
        } else {
          console.error('❌ Error inesperado:', checkResponse.status);
        }
      } catch (error) {
        console.error('❌ Error en callback de autenticación:', error);
      } finally {
        setIsProcessing(false);
      }
    }

    handleAuthCallback();
  }, [isLoaded, isSignedIn, user, isProcessing, router]);

  return null; // Este componente no renderiza nada
}

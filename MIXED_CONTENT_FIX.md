# Solución al Error de Mixed Content (HTTP/HTTPS)

## Problema identificado
El error se encuentra en el **frontend**, no en el backend. 

### Descripción del error:
- Tu aplicación está desplegada en Vercel con HTTPS: `https://linktech-management.vercel.app`
- Tu API backend usa HTTP: `http://13.56.13.129`
- Los navegadores bloquean peticiones HTTP desde páginas HTTPS (Mixed Content Policy)

## Solución implementada

### 1. Configuración centralizada de API
- ✅ Creé `/src/config/api.ts` para centralizar todas las URLs de la API
- ✅ Actualicé todos los hooks y componentes para usar esta configuración
- ✅ Agregué variables de entorno para desarrollo y producción

### 2. Archivos modificados:
- `src/config/api.ts` (nuevo)
- `src/hooks/useProjects.ts`
- `src/hooks/useProjectManagers.ts`
- `src/hooks/useEmployees.ts`
- `src/hooks/useClients.ts`
- `src/hooks/useDepartments.tsx`
- `src/hooks/useAsuetos.ts`
- `src/hooks/useWorkers.ts`
- `src/app/dashboard/projects/page.tsx`
- `src/app/dashboard/projects/edit/[id]/page.tsx`
- `src/app/dashboard/workers/new/page.tsx`
- `.env.local`
- `.env.production`

## Configuración requerida para producción

### En Vercel (Panel de control):
1. Ve a tu proyecto en Vercel
2. Ve a Settings → Environment Variables
3. Agrega: 
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://backend.linktech.com.mx` ✅ (HTTPS configurado)

### ✅ Backend actualizado:
- **Nueva URL:** `https://backend.linktech.com.mx`
- **Protocolo:** HTTPS (soporta conexiones seguras)
- **Estado:** Listo para producción

## Verificación

### Para desarrollo local:
```bash
npm run dev
# Debe funcionar con http://13.56.13.129 (HTTP está permitido en localhost)
```

### Para producción:
1. Actualiza la variable `NEXT_PUBLIC_API_URL` en Vercel
2. Redeploy tu aplicación
3. Verifica que todas las peticiones usen HTTPS

## Estado actual
✅ Frontend preparado para usar HTTPS  
✅ Backend configurado con HTTPS: `backend.linktech.com.mx`  
⚠️ Variable de entorno en Vercel necesita actualización  

## Próximos pasos
1. **Actualizar variable de entorno en Vercel:** `NEXT_PUBLIC_API_URL=https://backend.linktech.com.mx`
2. **Redeploy la aplicación**
3. **Probar en producción**
4. **Verificar certificado SSL** del backend (debe ser válido)
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
   - Value: `https://tu-backend-seguro.com` (⚠️ DEBE SER HTTPS)

### Opciones para el backend:

#### Opción 1: Configurar HTTPS en tu servidor (RECOMENDADO)
- Agrega un certificado SSL a tu servidor `13.56.13.129`
- Configura tu backend para servir HTTPS en el puerto 443
- Actualiza la variable de entorno a `https://13.56.13.129`

#### Opción 2: Proxy reverso con HTTPS
- Usa un servicio como Cloudflare, AWS CloudFront, o Nginx
- Configura un dominio con SSL que haga proxy a tu servidor HTTP
- Ejemplo: `https://api.tudominio.com` → `http://13.56.13.129`

#### Opción 3: Migrar a un servicio en la nube
- AWS API Gateway + Lambda
- Google Cloud Run
- Heroku
- Railway
- Todos estos incluyen HTTPS por defecto

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
⚠️ Backend necesita configuración HTTPS  
⚠️ Variable de entorno en Vercel necesita actualización  

## Próximos pasos
1. **Configurar HTTPS en tu backend** (crítico)
2. **Actualizar variable de entorno en Vercel**
3. **Redeploy la aplicación**
4. **Probar en producción**
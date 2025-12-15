# Rutas Protegidas - Sistema de Permisos

## Resumen de Implementación

Todas las páginas del dashboard están ahora protegidas con el componente `ProtectedRoute`, que valida los permisos del usuario antes de mostrar el contenido.

## Páginas Protegidas ✅

| Ruta | Permiso Requerido | Estado |
|------|------------------|--------|
| `/dashboard/projects` | `projects` | ✅ Protegido |
| `/dashboard/workers` | `workers` | ✅ Protegido |
| `/dashboard/consultants` | `consultants` | ✅ Protegido |
| `/dashboard/client` | `client` | ✅ Protegido |
| `/dashboard/billing` | `billing` | ✅ Protegido |
| `/dashboard/metrics` | `metrics` | ✅ Protegido |
| `/dashboard/cargabilidad` | `cargabilidad` | ✅ Protegido |
| `/dashboard/proyeccion` | `proyeccion` | ✅ Protegido |
| `/dashboard/disponibilidad` | `disponibilidad` | ✅ Protegido |
| `/dashboard/departamento` | `departamentos` | ✅ Protegido |
| `/dashboard/usuarios` | `usuarios` | ✅ Protegido |
| `/dashboard/asuetos` | `asuetos` | ✅ Protegido |
| `/dashboard/especialidades` | `especialidades` | ✅ Protegido |
| `/dashboard/esquema-contratacion` | `esquemaContratacion` | ✅ Protegido |
| `/dashboard/horas-contrato` | `horasContrato` | ✅ Protegido |
| `/dashboard/horas-por-aprobar` | `horasPorAprobar` | ✅ Protegido |
| `/dashboard/solicitud_horas` | `solicitudHoras` | ✅ Protegido |

## Cómo Funciona

### 1. Componente ProtectedRoute

```tsx
<ProtectedRoute requiredPermission="projects">
  {/* Contenido de la página */}
</ProtectedRoute>
```

### 2. Flujo de Validación

1. El usuario accede a una ruta protegida (ej: `/dashboard/projects`)
2. El componente `ProtectedRoute` obtiene el email del usuario desde Clerk
3. Hace una petición a la API para obtener los permisos del usuario:
   ```
   GET https://linktech-ma-server-db.vercel.app/api/permissions?email=usuario@email.com
   ```
4. Valida si el usuario tiene el permiso requerido
5. Si tiene permiso: muestra el contenido
6. Si NO tiene permiso: redirige a `/dashboard` con advertencia en consola

### 3. Estados de Carga

- **Loading**: Muestra spinner mientras valida permisos
- **Authorized**: Renderiza el contenido de la página
- **Unauthorized**: Redirige al dashboard principal

## Estructura de Permisos en MongoDB

```json
{
  "email": "abraham.castaneda@linktech.com.mx",
  "name": "Abraham Castañeda",
  "role": "admin",
  "isActive": true,
  "dashboard": true,
  "projects": true,
  "consultants": true,
  "workers": true,
  "client": false,  // Usuario NO tiene acceso a esta sección
  "billing": true,
  "metrics": true,
  "cargabilidad": true,
  "proyeccion": true,
  "disponibilidad": true,
  "departamentos": true,
  "usuarios": true,
  "analisis": true,
  "asuetos": true,
  "especialidades": true,
  "esquemaContratacion": true,
  "horasContrato": true,
  "horasPorAprobar": true,
  "solicitudHoras": true,
  "canCreate": true,
  "canEdit": true,
  "canDelete": true,
  "canExport": true
}
```

## Contexto de Permisos

Todas las páginas tienen acceso al contexto de permisos a través del hook `usePermissions`:

```tsx
import { usePermissions } from '@/contexts/permissions-context';

function MyComponent() {
  const { hasPermission, canCreate, canEdit, canDelete, role } = usePermissions();
  
  // Verificar un permiso específico
  if (hasPermission('projects')) {
    // Usuario puede ver proyectos
  }
  
  // Usar permisos de acción
  if (canCreate) {
    // Mostrar botón de crear
  }
}
```

## Ejemplo de Usuario con Permisos Limitados

Si un usuario tiene `client: false`, al intentar acceder a `/dashboard/client`:

1. Ve el spinner de carga
2. Se validan sus permisos
3. Se detecta que NO tiene acceso
4. Se muestra en consola: `⚠️ Usuario no tiene permiso para: client`
5. Es redirigido a `/dashboard`

## Testing

Para probar el sistema de permisos:

1. **Login como admin**: `abraham.castaneda@linktech.com.mx`
   - Debe tener acceso a todas las páginas EXCEPTO `client`

2. **Verificar redirección**:
   - Navegar a `/dashboard/client`
   - Debe redirigir a `/dashboard`

3. **Verificar páginas accesibles**:
   - Navegar a `/dashboard/projects` → ✅ Debe mostrar contenido
   - Navegar a `/dashboard/workers` → ✅ Debe mostrar contenido
   - etc.

## API de Permisos

**Endpoint**: `https://linktech-ma-server-db.vercel.app/api/permissions`

**Método**: GET

**Query Params**:
- `email` (required): Email del usuario

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "email": "...",
    "name": "...",
    "role": "admin",
    "permissions": {
      "dashboard": true,
      "projects": true,
      ...
    }
  }
}
```

## Archivos Modificados

- ✅ `src/app/dashboard/projects/page.tsx`
- ✅ `src/app/dashboard/workers/page.tsx`
- ✅ `src/app/dashboard/consultants/page.tsx`
- ✅ `src/app/dashboard/client/page.tsx`
- ✅ `src/app/dashboard/billing/page.tsx`
- ✅ `src/app/dashboard/metrics/page.tsx`
- ✅ `src/app/dashboard/cargabilidad/page.tsx`
- ✅ `src/app/dashboard/proyeccion/page.tsx`
- ✅ `src/app/dashboard/disponibilidad/page.tsx`
- ✅ `src/app/dashboard/departamento/page.tsx`
- ✅ `src/app/dashboard/usuarios/page.tsx`
- ✅ `src/app/dashboard/asuetos/page.tsx`
- ✅ `src/app/dashboard/especialidades/page.tsx`
- ✅ `src/app/dashboard/esquema-contratacion/page.tsx`
- ✅ `src/app/dashboard/horas-contrato/page.tsx`
- ✅ `src/app/dashboard/horas-por-aprobar/page.tsx`
- ✅ `src/app/dashboard/solicitud_horas/page.tsx`

## Archivos de Infraestructura

- `src/contexts/permissions-context.tsx` - Contexto global de permisos
- `src/components/ProtectedRoute.tsx` - Componente de protección
- `src/lib/permissions.ts` - Cliente API de permisos
- `src/types/permissions.ts` - Tipos TypeScript
- `src/app/dashboard/layout.tsx` - Provider de permisos

## Próximos Pasos

1. **Crear usuarios de prueba** con diferentes roles:
   - Manager con permisos limitados
   - Employee con permisos básicos
   - Viewer solo lectura

2. **Proteger acciones dentro de páginas**:
   - Deshabilitar botones "Crear" si `canCreate: false`
   - Ocultar botones "Eliminar" si `canDelete: false`
   - etc.

3. **Logging y auditoría**:
   - Registrar intentos de acceso no autorizados
   - Crear dashboard de auditoría de permisos

---

**Última actualización**: Diciembre 2024
**Estado**: ✅ Implementación completa - 17 páginas protegidas

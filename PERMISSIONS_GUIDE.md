# Guía de uso del sistema de permisos

## 🔒 Sistema de Control de Acceso

El sistema valida permisos usando el email de Clerk contra MongoDB Atlas.

## 📖 Uso en componentes

### Hook usePermissions

```tsx
'use client';
import { usePermissions } from '@/contexts/permissions-context';

export default function MiComponente() {
  const { hasPermission, canCreate, canEdit, canDelete, role, loading } = usePermissions();

  if (loading) return <div>Cargando permisos...</div>;

  return (
    <div>
      {hasPermission('projects') && <div>Puede ver proyectos</div>}
      {canCreate && <button>Crear</button>}
      {canEdit && <button>Editar</button>}
      {canDelete && <button>Eliminar</button>}
      <p>Rol: {role}</p>
    </div>
  );
}
```

### Proteger páginas completas

```tsx
// src/app/dashboard/projects/page.tsx
'use client';
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function ProjectsPage() {
  return (
    <ProtectedRoute requiredPermission="projects">
      <div>Contenido de proyectos</div>
    </ProtectedRoute>
  );
}
```

### Proteger rutas específicas

```tsx
// src/app/dashboard/workers/page.tsx
import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function WorkersPage() {
  return (
    <ProtectedRoute requiredPermission="workers" fallbackUrl="/dashboard">
      {/* Contenido solo visible para usuarios con permiso "workers" */}
    </ProtectedRoute>
  );
}
```

## 🗺️ Mapeo de rutas y permisos

| Ruta | Permiso requerido |
|------|------------------|
| `/dashboard/projects` | `projects` |
| `/dashboard/consultants` | `consultants` |
| `/dashboard/workers` | `workers` |
| `/dashboard/client` | `client` |
| `/dashboard/billing` | `billing` |
| `/dashboard/metrics` | `metrics` |
| `/dashboard/cargabilidad` | `cargabilidad` |
| `/dashboard/proyeccion` | `proyeccion` |
| `/dashboard/disponibilidad` | `disponibilidad` |
| `/dashboard/departamento` | `departamentos` |
| `/dashboard/usuarios` | `usuarios` |
| `/dashboard/analisis` | `analisis` |
| `/dashboard/asuetos` | `asuetos` |
| `/dashboard/especialidades` | `especialidades` |
| `/dashboard/esquema-contratacion` | `esquemaContratacion` |
| `/dashboard/horas-contrato` | `horasContrato` |
| `/dashboard/horas-por-aprobar` | `horasPorAprobar` |
| `/dashboard/solicitud_horas` | `solicitudHoras` |

## 🎭 Permisos de acciones

- `canCreate`: Puede crear nuevos registros
- `canEdit`: Puede editar registros existentes
- `canDelete`: Puede eliminar registros
- `canExport`: Puede exportar datos

## 🔧 Condicionar botones por permisos

```tsx
const { canCreate, canEdit, canDelete } = usePermissions();

return (
  <div>
    {canCreate && <button onClick={handleCreate}>Crear</button>}
    {canEdit && <button onClick={handleEdit}>Editar</button>}
    {canDelete && <button onClick={handleDelete}>Eliminar</button>}
  </div>
);
```

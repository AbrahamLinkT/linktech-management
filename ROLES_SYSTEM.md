# Sistema de Gestión de Roles

## 📋 Descripción General

El sistema de gestión de roles permite administrar los permisos de usuarios mediante 3 roles predefinidos:

### 🔐 Roles Disponibles

#### 1. **Admin (Full Access)** 
- **Descripción**: Acceso completo a todos los módulos y funcionalidades
- **Permisos**: TODOS habilitados (23 módulos + 4 acciones)
- **Uso**: Administradores del sistema

#### 2. **Líder de Proyecto**
- **Descripción**: Acceso a gestión de proyectos y equipo
- **Permisos**: Todos excepto `usuarios: false`
- **Uso**: Managers, líderes de equipos

#### 3. **Worker**
- **Descripción**: Sin permisos por defecto
- **Permisos**: Todos en `false`
- **Uso**: Usuarios nuevos, requieren asignación específica

---

## 🛠️ Funcionalidades

### Vista de Gestión (`/dashboard/usuarios`)

La tabla de gestión de roles permite:

1. **Listar usuarios**: Carga automática desde la API
2. **Ver información**:
   - Nombre
   - Correo electrónico
   - Rol actual
   - Estado (Activo/Inactivo)

3. **Cambiar roles**:
   - Selector dropdown con los 3 roles
   - Actualización en tiempo real
   - Asignación automática de permisos según el rol

4. **Actualizar datos**: Botón de refrescar para sincronizar

### Tarjetas Informativas

En la parte superior se muestran 3 tarjetas con:
- Icono distintivo por rol
- Nombre del rol
- Descripción de permisos

---

## 📊 Permisos por Rol

### Módulos (23 permisos):
```
dashboard, projects, consultants, workers, client, 
billing, metrics, cargabilidad, proyeccion, 
disponibilidad, departamentos, usuarios, analisis, 
asuetos, especialidades, esquemaContratacion, 
horasContrato, horasPorAprobar, solicitudHoras
```

### Acciones (4 permisos):
```
canCreate, canEdit, canDelete, canExport
```

---

## 🔗 Archivos Principales

### 1. `/src/constants/role-profiles.ts`
Define los perfiles de roles con todos los permisos:

```typescript
export const ROLE_PROFILES: Record<RoleType, RolePermissions> = {
  admin: { /* todos true */ },
  lider: { /* todos true excepto usuarios */ },
  worker: { /* todos false */ }
};
```

### 2. `/src/components/roles/RoleTable.tsx`
Componente principal de la interfaz:
- Carga usuarios desde API
- Permite editar roles
- Actualiza permisos automáticamente
- UI con badges y colores por rol

### 3. `/src/types/permissions.ts`
Tipos TypeScript:
- `UserListItem`: Estructura de usuario
- `RoleType`: 'admin' | 'lider' | 'worker'

### 4. `/src/lib/permissions.ts`
Funciones de API:
- `getAllUsers()`: Obtiene todos los usuarios
- `updateUserRole()`: Actualiza rol y permisos
- `getUserPermissions()`: Obtiene permisos de un usuario

---

## 🔄 Flujo de Actualización de Rol

```mermaid
1. Usuario hace clic en "Cambiar Rol"
   ↓
2. Aparece selector con 3 roles
   ↓
3. Usuario selecciona nuevo rol
   ↓
4. Click en "Guardar"
   ↓
5. Sistema busca permisos del rol en ROLE_PROFILES
   ↓
6. PUT request a API con email, role y permissions
   ↓
7. MongoDB actualiza documento
   ↓
8. UI se actualiza con nuevo badge
   ↓
9. Usuario ya tiene nuevos permisos activos
```

---

## 🎨 Diseño Visual

### Badges de Roles:

- **Admin**: 🟣 Morado (bg-purple-100, border-purple-300)
- **Líder**: 🔵 Azul (bg-blue-100, border-blue-300)
- **Worker**: ⚪ Gris (bg-gray-100, border-gray-300)

### Iconos:
- **Admin**: 🛡️ Shield
- **Líder**: ✅ UserCheck
- **Worker**: 👥 Users

---

## 📡 API Endpoint

**Base URL**: `https://linktech-management-a.vercel.app/api/permissions`

### GET (Listar todos)
```bash
GET /api/permissions
Response: { success: true, data: [usuarios] }
```

### PUT (Actualizar rol)
```bash
PUT /api/permissions
Body: {
  email: "usuario@example.com",
  role: "lider",
  permissions: { dashboard: true, ... }
}
Response: { success: true, data: {usuario actualizado} }
```

---

## ✅ Características de Seguridad

1. **Validación de roles**: Solo 3 roles permitidos
2. **Actualización atómica**: Rol + permisos se actualizan juntos
3. **Estado de carga**: UI muestra cuando está guardando
4. **Manejo de errores**: Alertas si falla la actualización
5. **Cache deshabilitado**: Siempre datos frescos de MongoDB

---

## 🚀 Uso

1. Navegar a `/dashboard/usuarios`
2. Ver listado de todos los usuarios del sistema
3. Click en "Cambiar Rol" en el usuario deseado
4. Seleccionar rol del dropdown
5. Click en "Guardar"
6. Confirmar que el badge se actualiza

**Nota**: Los cambios son inmediatos. El usuario debe recargar su sesión para ver los nuevos permisos.

---

## 🔧 Desarrollo

### Agregar un nuevo rol:

1. Editar `role-profiles.ts`:
   ```typescript
   export type RoleType = 'admin' | 'lider' | 'worker' | 'NUEVO_ROL';
   
   export const ROLE_PROFILES = {
     ...existentes,
     NUEVO_ROL: { /* permisos */ }
   };
   ```

2. Actualizar `types/permissions.ts`
3. El resto se actualiza automáticamente

### Agregar nuevo permiso:

1. Agregar campo en `RolePermissions` interface
2. Agregar en cada perfil de ROLE_PROFILES
3. Actualizar schema de MongoDB en backend

---

## 📝 Notas

- Los usuarios nuevos se crean automáticamente como "worker"
- Solo usuarios con rol "admin" pueden acceder a la gestión de usuarios
- La tabla muestra estado "Activo/Inactivo" del usuario
- Botón "Actualizar" para refrescar datos desde MongoDB

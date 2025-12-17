# Sistema de Creación Automática de Usuarios

## Flujo Automático Post-Login

Cuando un usuario inicia sesión con Clerk, el sistema automáticamente:

### 1. **Verificación de Usuario** 🔍
```
Usuario inicia sesión → Clerk autentica → Sistema verifica en MongoDB
```

### 2. **Decisión Automática** 🔀

**Si el usuario EXISTE:**
```javascript
GET /api/permissions?email=usuario@email.com
Status: 200 OK
→ Carga permisos existentes
```

**Si el usuario NO EXISTE:**
```javascript
GET /api/permissions?email=usuario@email.com
Status: 404 Not Found
↓
POST /api/permissions
Body: {
  "email": "usuario@email.com",
  "name": "Usuario Nuevo",
  "role": "worker",
  "permissions": { /* todos en false */ },
  "isActive": true
}
Status: 201 Created
→ Usuario creado automáticamente
```

## Permisos por Defecto para Nuevos Usuarios

Todos los usuarios nuevos se crean con:

```json
{
  "email": "nuevo@email.com",
  "name": "Nombre del Usuario",
  "role": "worker",
  "permissions": {
    "dashboard": false,
    "projects": false,
    "consultants": false,
    "workers": false,
    "client": false,
    "billing": false,
    "metrics": false,
    "cargabilidad": false,
    "proyeccion": false,
    "disponibilidad": false,
    "departamentos": false,
    "usuarios": false,
    "analisis": false,
    "asuetos": false,
    "especialidades": false,
    "esquemaContratacion": false,
    "horasContrato": false,
    "horasPorAprobar": false,
    "solicitudHoras": false,
    "canCreate": false,
    "canEdit": false,
    "canDelete": false,
    "canExport": false
  },
  "isActive": true
}
```

## Comportamiento del Usuario Nuevo

### En el Dashboard
- ✅ Puede iniciar sesión exitosamente
- ❌ NO verá ninguna sección en el sidebar (todos los permisos en false)
- ⚠️ Verá la pantalla "Permisos no habilitados" si intenta acceder a cualquier ruta

### Mensaje al Usuario
```
🛡️ Permisos no habilitados

No tienes acceso a esta sección del sistema.

Si necesitas acceso a este módulo, por favor 
comunícate con tu jefe de área para solicitar 
los permisos correspondientes.

[Volver al Dashboard]
```

## Asignación de Permisos

Para habilitar acceso a un usuario nuevo, un administrador debe:

### Opción 1: Actualizar vía API
```bash
curl -X PUT "https://linktech-management-a.vercel.app/api/permissions?email=usuario@email.com" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "dashboard": true,
      "projects": true,
      "workers": true
    }
  }'
```

### Opción 2: Actualizar en MongoDB Atlas
1. Conectar a MongoDB Atlas
2. Navegar a la colección `UserPermissions`
3. Buscar el usuario por email
4. Editar el campo `permissions`
5. Cambiar los valores de `false` a `true` según sea necesario

## Logs del Sistema

### Console Logs durante Login

**Usuario Existente:**
```
🔐 Iniciando verificación de permisos para: usuario@email.com
✅ Permisos encontrados para usuario existente
```

**Usuario Nuevo:**
```
🔐 Iniciando verificación de permisos para: nuevo@email.com
➕ Usuario no encontrado, creando nuevo usuario...
✅ Usuario creado exitosamente con permisos por defecto
```

**Error:**
```
❌ Error en verificación/creación de permisos: [detalles del error]
```

## Ventajas del Sistema

1. **Automatización Total** 🤖
   - No requiere intervención manual para crear usuarios
   - Registro instantáneo al primer login

2. **Seguridad por Defecto** 🔒
   - Todos los nuevos usuarios inician sin permisos
   - Principio de "privilegio mínimo"

3. **Flexibilidad** ⚙️
   - Permisos granulares por módulo
   - Fácil actualización de permisos

4. **Auditoría** 📝
   - Registro automático de creación
   - Timestamps en MongoDB

## Estructura en MongoDB

```javascript
{
  "_id": ObjectId("..."),
  "email": "usuario@email.com",
  "name": "Usuario Ejemplo",
  "role": "worker",
  "permissions": {
    "dashboard": false,
    "projects": false,
    // ... resto de permisos
  },
  "isActive": true,
  "createdAt": ISODate("2025-12-17T..."),
  "updatedAt": ISODate("2025-12-17T...")
}
```

## API Endpoints

### GET - Obtener permisos
```
GET /api/permissions?email=usuario@email.com
Response: 200 OK o 404 Not Found
```

### POST - Crear usuario (automático)
```
POST /api/permissions
Body: { email, name, role, permissions, isActive }
Response: 201 Created o 409 Conflict (si ya existe)
```

### PUT - Actualizar permisos
```
PUT /api/permissions?email=usuario@email.com
Body: { name?, role?, permissions?, isActive? }
Response: 200 OK o 404 Not Found
```

### DELETE - Eliminar usuario
```
DELETE /api/permissions?email=usuario@email.com
Response: 200 OK o 404 Not Found
```

## Ejemplo de Flujo Completo

```
1. Usuario se registra en Clerk ✉️
   ↓
2. Usuario inicia sesión 🔐
   ↓
3. Sistema verifica email en MongoDB 🔍
   ↓
4. No encontrado → Crea automáticamente ➕
   {
     email: "nuevo@email.com",
     role: "worker",
     permissions: { all: false }
   }
   ↓
5. Usuario accede al dashboard 📊
   ↓
6. Sidebar vacío (sin permisos) ⚠️
   ↓
7. Administrador asigna permisos 👨‍💼
   PUT /api/permissions?email=nuevo@email.com
   { permissions: { projects: true, workers: true } }
   ↓
8. Usuario recarga página 🔄
   ↓
9. Ahora ve "Proyectos" y "Trabajadores" en sidebar ✅
```

## Archivo de Implementación

**Contexto de Permisos:**
```
src/contexts/permissions-context.tsx
```

**API Client:**
```
src/lib/permissions.ts
```

**Endpoint Serverless:**
```
server/api/permissions.js
```

---

**Estado**: ✅ Implementado y Funcional
**Fecha**: Diciembre 2025

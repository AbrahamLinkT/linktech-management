# API de Permisos de Usuario

API para gestionar permisos de usuarios en MongoDB.

**Base URL**: `https://linktech-management-a.vercel.app/api/permissions`

---

## Endpoints

### 1. GET - Obtener Permisos de Usuario

**URL**: `GET /api/permissions?email={email}`

**Descripción**: Obtiene los permisos de un usuario específico por su email.

**Query Parameters**:
- `email` (required): Email del usuario

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "email": "usuario@example.com",
  "name": "Juan Pérez",
  "role": "worker",
  "permissions": {
    "dashboard": true,
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

**Errores**:
- `400`: Email no proporcionado
- `404`: Usuario no encontrado
- `403`: Usuario inactivo

---

### 2. GET - Listar Todos los Usuarios

**URL**: `GET /api/permissions`

**Descripción**: Lista todos los usuarios y sus permisos.

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "count": 2,
  "users": [
    {
      "_id": "...",
      "email": "usuario1@example.com",
      "name": "Usuario 1",
      "role": "admin",
      "permissions": { ... },
      "isActive": true,
      "createdAt": "2024-12-15T10:00:00.000Z",
      "updatedAt": "2024-12-15T10:00:00.000Z"
    },
    ...
  ]
}
```

---

### 3. POST - Crear Nuevo Usuario

**URL**: `POST /api/permissions`

**Descripción**: Crea un nuevo usuario con todos los permisos en `false` por defecto.

**Content-Type**: `application/json`

**Body** (JSON):
```json
{
  "email": "nuevo@example.com",
  "name": "Nuevo Usuario",
  "role": "worker"
}
```

**Campos**:
- `email` (required): Email del usuario (se convierte a lowercase)
- `name` (optional): Nombre del usuario (default: '')
- `role` (optional): Rol del usuario (default: 'worker')
  - Valores válidos: `admin`, `manager`, `employee`, `viewer`, `worker`

**Respuesta Exitosa** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "email": "nuevo@example.com",
    "name": "Nuevo Usuario",
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
}
```

**Errores**:
- `400`: Email no proporcionado
- `409`: Usuario ya existe (usar PUT para actualizar)

---

### 4. PUT - Actualizar Usuario Existente

**URL**: `PUT /api/permissions?email={email}`

**Descripción**: Actualiza los permisos y datos de un usuario existente. Solo actualiza los campos proporcionados.

**Content-Type**: `application/json`

**Query Parameters**:
- `email` (required): Email del usuario a actualizar

**Body** (JSON):
```json
{
  "name": "Nombre Actualizado",
  "role": "manager",
  "permissions": {
    "dashboard": true,
    "projects": true,
    "workers": true
  },
  "isActive": true
}
```

**Campos** (todos opcionales):
- `name`: Actualizar nombre del usuario
- `role`: Actualizar rol del usuario
- `permissions`: Objeto con permisos a actualizar (mantiene los no especificados)
- `isActive`: Activar/desactivar usuario

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "email": "usuario@example.com",
    "name": "Nombre Actualizado",
    "role": "manager",
    "permissions": {
      "dashboard": true,
      "projects": true,
      "consultants": false,
      "workers": true,
      ...
    },
    "isActive": true
  }
}
```

**Errores**:
- `400`: Email no proporcionado
- `404`: Usuario no encontrado (usar POST para crear)

---

### 5. DELETE - Eliminar Usuario

**URL**: `DELETE /api/permissions?email={email}`

**Descripción**: Elimina un usuario del sistema.

**Query Parameters**:
- `email` (required): Email del usuario a eliminar

**Respuesta Exitosa** (200):
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Errores**:
- `400`: Email no proporcionado
- `404`: Usuario no encontrado

---

## Ejemplos de Uso

### Ejemplo 1: Crear un nuevo usuario

```bash
curl -X POST https://linktech-management-a.vercel.app/api/permissions \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan.perez@linktech.com.mx",
    "name": "Juan Pérez",
    "role": "worker"
  }'
```

### Ejemplo 2: Actualizar permisos de usuario

```bash
curl -X PUT "https://linktech-management-a.vercel.app/api/permissions?email=juan.perez@linktech.com.mx" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "dashboard": true,
      "projects": true,
      "workers": true,
      "canEdit": true
    }
  }'
```

### Ejemplo 3: Obtener permisos de usuario

```bash
curl -X GET "https://linktech-management-a.vercel.app/api/permissions?email=juan.perez@linktech.com.mx"
```

### Ejemplo 4: Listar todos los usuarios

```bash
curl -X GET "https://linktech-management-a.vercel.app/api/permissions"
```

### Ejemplo 5: Eliminar usuario

```bash
curl -X DELETE "https://linktech-management-a.vercel.app/api/permissions?email=juan.perez@linktech.com.mx"
```

---

## Notas Importantes

1. **Nuevos Usuarios**: Al crear un usuario con POST, TODOS los permisos se establecen en `false` por defecto.

2. **Actualización Parcial**: PUT permite actualizar solo los permisos especificados, manteniendo los demás intactos.

3. **Email Único**: El email es único y se convierte automáticamente a lowercase.

4. **Rol por Defecto**: Si no se especifica rol al crear, se asigna `worker`.

5. **Usuario Activo**: Nuevos usuarios se crean con `isActive: true` por defecto.

6. **CORS**: La API tiene CORS habilitado para todas las origins.

---

## Flujo Recomendado

1. **Crear usuario**: `POST /api/permissions`
   - Se crea con todos los permisos en `false`

2. **Asignar permisos**: `PUT /api/permissions?email={email}`
   - Habilitar solo los módulos necesarios

3. **Consultar permisos**: `GET /api/permissions?email={email}`
   - Verificar permisos antes de mostrar UI

4. **Actualizar permisos**: `PUT /api/permissions?email={email}`
   - Modificar permisos según sea necesario

5. **Desactivar usuario**: `PUT /api/permissions?email={email}`
   - Establecer `isActive: false` en lugar de eliminar

6. **Eliminar usuario**: `DELETE /api/permissions?email={email}`
   - Solo si es necesario eliminar permanentemente

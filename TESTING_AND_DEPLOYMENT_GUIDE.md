# Guía de Testing e Implementación - Sistema de Aprobación

## Checklist de Implementación

### ✅ Backend (Node.js/MongoDB)

- [x] Crear modelo `StaffAssignmentRequest.js`
- [x] Crear rutas API en `staffAssignmentRequests.js`
- [x] Registrar rutas en `server/index.js`
- [ ] Crear índices de MongoDB
- [ ] Configurar variables de entorno SMTP

### ✅ Frontend (Next.js)

- [x] Crear servicio `staffAssignmentService.ts`
- [x] Actualizar `proyeccion/page.tsx` con lógica de solicitudes
- [x] Actualizar `horas-por-aprobar/page.tsx` con aprobaciones
- [ ] Testing manual en desarrollo
- [ ] Testing en staging

### ✅ Integraciones

- [x] Email de notificación al crear solicitud
- [x] Creación de asignación al aprobar
- [ ] Notificación al solicitante (opcional)

---

## Variables de Entorno Necesarias

### Servidor (`.env`)

```env
# MongoDB
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname

# SMTP para emails
SMTP_ENABLED=true
MAIL_USER=tu_email@gmail.com
MAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
MAIL_FROM=noreply@linktech.com.mx

# Backend Java
JAVA_BACKEND_URL=http://localhost:8080
API_PROXY_URL=http://localhost:8080

# Puertos
PORT=3001
NODE_ENV=development
```

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_API_URL=http://localhost:8080
```

---

## Plan de Testing

### Fase 1: Testing Local

#### Requisitos
- ✅ MongoDB local corriendo en puerto 27017
- ✅ Backend Java en puerto 8080
- ✅ Frontend en puerto 3000
- ✅ Servidor Node.js en puerto 3001

#### Test Case 1: Asignar Consultor del Mismo Departamento

**Objetivo:** Verificar que consultores del mismo departamento se asignan directamente

**Pasos:**
1. Login como usuario en Departamento "Delivery Center"
2. Ir a `/dashboard/proyeccion`
3. Seleccionar un proyecto válido
4. Seleccionar un consultor del mismo departamento "Delivery Center"
5. Click en "Agregar Seleccionados"

**Resultado Esperado:**
```
✅ 1 consultor(es) procesado(s)
✅ 1 asignado(s) directamente (mismo departamento)
```

**Verificaciones:**
- [ ] Consultor aparece en tabla de proyecto
- [ ] No se crea solicitud en MongoDB
- [ ] No se envía email de notificación

---

#### Test Case 2: Asignar Consultor de Otro Departamento

**Objetivo:** Verificar que consultores de otros departamentos crean solicitudes pendientes

**Pasos:**
1. Login como usuario en Departamento "Delivery Center"
2. Ir a `/dashboard/proyeccion`
3. Seleccionar un proyecto válido
4. Seleccionar un consultor de departamento diferente (ej: "Finance")
5. Click en "Agregar Seleccionados"

**Resultado Esperado:**
```
✅ 1 consultor(es) procesado(s)
⏳ 1 en estado PENDIENTE (esperando aprobación del líder)
```

**Verificaciones:**
- [ ] Consultor NO aparece en tabla de proyecto (aún no asignado)
- [ ] Se crea documento en MongoDB `staffassignmentrequests`
  ```javascript
  {
    status: "pending",
    worker_name: "Consultor Name",
    department_head_email: "leader@empresa.com"
  }
  ```
- [ ] Se envía email a `leader@empresa.com`
  - [ ] Subject contiene nombre del proyecto
  - [ ] Body contiene tabla XLSX
  - [ ] Body contiene nombre del consultor

---

#### Test Case 3: Líder Aprueba Solicitud

**Objetivo:** Verificar que líder puede aprobar y se crea la asignación

**Pasos:**
1. Login como líder del departamento de "Finance"
2. Ir a `/dashboard/horas-por-aprobar`
3. Buscar sección "📋 Solicitudes de Asignación Pendientes"
4. Encontrar solicitud del consultor creado en Test Case 2
5. Click en botón "Aprobar"
6. Modal pregunta confirmación
7. Click "Confirmar"

**Resultado Esperado:**
```
✅ Solicitud aprobada y consultor asignado al proyecto
```

**Verificaciones:**
- [ ] Solicitud desaparece de tabla pending
- [ ] Documento MongoDB se actualiza:
  ```javascript
  {
    status: "approved",
    approved_by: "leader_id",
    approved_at: Date.now()
  }
  ```
- [ ] Consultor aparece en lista de asignados del proyecto
- [ ] Se crea registro en `assigned_hours` (SQL)

---

#### Test Case 4: Líder Rechaza Solicitud

**Objetivo:** Verificar que líder puede rechazar sin crear asignación

**Pasos:**
1. Login como líder del departamento de "Finance"
2. Ir a `/dashboard/horas-por-aprobar`
3. Encontrar una solicitud pending
4. Click en botón "Rechazar"
5. Ingresar motivo: "No disponible en esa fecha"
6. Confirmar

**Resultado Esperado:**
```
✅ Solicitud rechazada
```

**Verificaciones:**
- [ ] Solicitud desaparece de tabla pending
- [ ] Documento MongoDB se actualiza:
  ```javascript
  {
    status: "rejected",
    rejection_reason: "No disponible en esa fecha",
    rejected_at: Date.now()
  }
  ```
- [ ] Consultor NO se asigna al proyecto
- [ ] No se crea registro en `assigned_hours`

---

#### Test Case 5: Email de Notificación

**Objetivo:** Verificar que email se envía correctamente

**Pasos:**
1. Ejecutar Test Case 2
2. Revisar email recibido por el líder

**Resultado Esperado:**
Email con estructura:
```
De: noreply@linktech.com.mx
Para: leader@empresa.com
Subject: Solicitud de asignación de recurso - NOMBRE_PROYECTO

Body:
Hola [NOMBRE_LIDER],

Se ha realizado una solicitud de asignación de recurso humano

[Caja Azul con Proyecto: NOMBRE]

[Tabla XLSX con:
  Nombre, Email, Departamento, Rol, Nivel, Ubicación, 
  Fecha de Contratación, Código de Empleado]

Por favor revisa esta solicitud en tu panel de control.
```

---

### Fase 2: Testing de Integración

#### Test Case 6: Flujo Completo Multi-Usuario

**Objetivo:** Verificar todo el flujo con múltiples usuarios

**Pasos:**
1. **Usuario A (Manager):** Asignar 2 consultores: 1 mismo dept, 1 otro dept
2. **Verificar:** 1 asignado, 1 pending
3. **Usuario B (Líder):** Aprobar la solicitud pending
4. **Verificar:** Ambos consultores en lista de proyecto

---

#### Test Case 7: Manejo de Errores

**Objetivo:** Verificar manejo de errores

**Escenarios:**
1. SMTP deshabilitado → Crear solicitud sin enviar email
   - [ ] Solicitud se crea normalmente
   - [ ] Log muestra error SMTP
   - [ ] Usuario ve alerta pero operación continúa

2. MongoDB no disponible → Error al crear solicitud
   - [ ] Muestra error al usuario
   - [ ] No se crea asignación
   - [ ] Log contiene stack trace

3. Email inválido del líder → No envía notificación
   - [ ] Solicitud se crea
   - [ ] Log muestra error de email
   - [ ] User puede ver solicitud en horas-por-aprobar

---

### Fase 3: Testing de Performance

#### Test Case 8: Bulk Assignment

**Objetivo:** Verificar rendimiento con múltiples asignaciones

**Pasos:**
1. Crear proyecto con 20 consultores (10 mismo dept, 10 otros)
2. Asignar todos a la vez
3. Medir tiempo de respuesta
4. Verificar todas las solicitudes se crean

**Métrica Esperada:**
- [ ] < 5 segundos para 20 asignaciones
- [ ] 10 registros en assigned_hours
- [ ] 10 documentos en staffassignmentrequests
- [ ] 10 emails enviados

---

#### Test Case 9: Búsqueda de Solicitudes Pendientes

**Objetivo:** Verificar rendimiento de queries de MongoDB

**Pasos:**
1. Crear 100 solicitudes (50 pending, 50 approved)
2. Abrir horas-por-aprobar
3. Medir tiempo de carga

**Métrica Esperada:**
- [ ] < 1 segundo para cargar
- [ ] Solo mostrar 50 pending (con índice correcto)

---

## Comandos para Testing

### Crear datos de test en MongoDB

```javascript
// MongoDB Shell
use linktech_management

// Crear solicitud test
db.staffassignmentrequests.insertOne({
  project_id: "test-proj-001",
  project_name: "Proyecto Test",
  project_code: "TST-001",
  worker_id: "test-worker-001",
  worker_name: "Consultor Test",
  worker_email: "consultor@test.com",
  worker_department_id: "finance",
  worker_department_name: "Finance",
  department_head_id: "head-001",
  department_head_name: "Jefe Finance",
  department_head_email: "jefe.finance@empresa.com",
  requested_by_id: "mgr-001",
  requested_by_name: "Manager Delivery",
  requested_by_email: "mgr@empresa.com",
  status: "pending",
  created_at: new Date()
})

// Verificar creación
db.staffassignmentrequests.findOne()

// Cambiar estado a approved
db.staffassignmentrequests.updateOne(
  { _id: ObjectId("...") },
  { $set: { 
    status: "approved",
    approved_by: "head-001",
    approved_at: new Date()
  }}
)
```

### Verificar logs en el servidor

```bash
# Terminal donde corre el servidor Node
npm run dev

# Debería ver logs como:
# 📧 DEBUG email params: { name, email, projectName, hasXlsx, message }
# 📧 sendChangeHoursEmail received: { toName, toEmail, projectName, hasXlsx }
```

### Testing de API con cURL

```bash
# Crear solicitud
curl -X POST http://localhost:3001/api/staff-assignment-requests/create \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj-001",
    "project_name": "Proyecto Test",
    "project_code": "TST-001",
    "worker_id": "worker-001",
    "worker_name": "Juan Pérez",
    "worker_email": "juan@test.com",
    "worker_department_id": "finance",
    "worker_department_name": "Finance",
    "department_head_id": "head-001",
    "department_head_name": "Carlos López",
    "department_head_email": "carlos@empresa.com",
    "requested_by_id": "mgr-001",
    "requested_by_name": "Manager",
    "requested_by_email": "manager@empresa.com"
  }'

# Obtener pendientes
curl http://localhost:3001/api/staff-assignment-requests/pending/carlos@empresa.com

# Aprobar solicitud (reemplazar ID)
curl -X PUT http://localhost:3001/api/staff-assignment-requests/approve/SOLICITUD_ID \
  -H "Content-Type: application/json" \
  -d '{"approved_by": "head-001"}'
```

---

## Deployment Checklist

### Antes de Deploy a Staging

- [ ] Todos los tests locales pasando
- [ ] Variables de entorno configuradas en servidor
- [ ] Conexión a MongoDB verificada
- [ ] SMTP configurado y testeado
- [ ] Backend Java corriendo correctamente

### Antes de Deploy a Producción

- [ ] Tests en staging exitosos
- [ ] Backup de MongoDB antes de cambios
- [ ] Índices de MongoDB creados
- [ ] Cache limpiado (frontend y backend)
- [ ] Rollback plan documentado
- [ ] Monitoreo activado para nuevos endpoints

### Post-Deploy

- [ ] Verificar que nuevos endpoints responden
- [ ] Monitorear logs de errores
- [ ] Verificar creación de solicitudes
- [ ] Verificar envío de emails
- [ ] Monitorear performance de queries
- [ ] Confirmar aprobaciones funcionan

---

## Monitoreo y Métricas

### KPIs a Monitorear

1. **Tiempo de respuesta:**
   - POST /create < 500ms
   - GET /pending/:email < 1s
   - PUT /approve/:id < 500ms

2. **Volumen:**
   - Solicitudes creadas por día
   - Aprobación rate
   - Rechazo rate

3. **Errores:**
   - Fallos en creación
   - Fallos en envío de email
   - Fallos en aprobación

### Queries para Monitoreo

```javascript
// Solicitudes pendientes por líder
db.staffassignmentrequests.aggregate([
  { $match: { status: "pending" } },
  { $group: {
    _id: "$department_head_email",
    count: { $sum: 1 }
  }},
  { $sort: { count: -1 } }
])

// Tasa de aprobación
db.staffassignmentrequests.aggregate([
  { $group: {
    _id: "$status",
    count: { $sum: 1 }
  }}
])

// Tiempo promedio de aprobación
db.staffassignmentrequests.aggregate([
  { $match: { status: "approved" } },
  { $project: {
    duration: { $subtract: ["$approved_at", "$created_at"] }
  }},
  { $group: {
    _id: null,
    avgDuration: { $avg: "$duration" }
  }}
])
```

---

## Rollback Plan

Si hay problemas después del deploy:

### Opción 1: Deshabilitar la funcionalidad (Rápido)

```javascript
// En server/index.js, comentar la línea:
// app.use('/api/staff-assignment-requests', staffAssignmentRequestsRoutes);

// Los usuarios verán como si el feature no existe
```

### Opción 2: Revertir a commit anterior

```bash
git revert <commit_hash>
git push origin main
npm run build
npm run deploy
```

### Opción 3: Mantener datos pero deshabilitar operaciones

```javascript
// En las rutas, agregar guard:
if (process.env.FEATURE_STAFF_ASSIGNMENT_ENABLED !== 'true') {
  return res.status(503).json({ error: 'Funcionalidad deshabilitada' });
}
```

---

## Soporte y Debugging

### Logs útiles en servidor

```bash
# Activar logs detallados
DEBUG=* npm run dev

# Ver solo logs de staff-assignment
DEBUG=*staff* npm run dev

# Ver logs de SMTP
DEBUG=*smtp* npm run dev
```

### Debugging en MongoDB

```javascript
// Ver todas las solicitudes
db.staffassignmentrequests.find().pretty()

// Ver solicitud específica
db.staffassignmentrequests.findById(ObjectId("..."))

// Ver historial de cambios
db.staffassignmentrequests.find({ _id: ObjectId("...") })
  .sort({ updated_at: -1 })
```


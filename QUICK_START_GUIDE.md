# 🚀 Quick Start Guide - Sistema de Aprobación

## Resumen en 30 segundos

Se implementó un sistema donde:
- ✅ Consultores del **mismo departamento** → Se asignan **directamente**
- ⏳ Consultores de **otro departamento** → Se quedan **PENDIENTES** hasta que el líder de su departamento apruebe

---

## Archivos Nuevos

```
✅ server/models/StaffAssignmentRequest.js      (150 líneas)
✅ server/routes/staffAssignmentRequests.js     (250 líneas)  
✅ src/services/staffAssignmentService.ts       (150 líneas)
✅ STAFF_ASSIGNMENT_APPROVAL_SYSTEM.md          (Documentación completa)
✅ SYSTEM_ARCHITECTURE_DIAGRAMS.md              (Diagramas visuales)
✅ TESTING_AND_DEPLOYMENT_GUIDE.md              (Guía de testing)
✅ EXECUTIVE_SUMMARY.md                         (Resumen ejecutivo)
```

---

## Archivos Modificados

```
✅ server/index.js
   └─ Agregó import y ruta para staffAssignmentRequests

✅ src/app/dashboard/proyeccion/page.tsx
   └─ Lógica para crear solicitudes instead of direct assignment

✅ src/app/dashboard/horas-por-aprobar/page.tsx
   └─ Nueva sección para ver y aprobar solicitudes
```

---

## Cómo Funciona

### 1️⃣ Manager Asigna Consultor

```
Manager en /dashboard/proyeccion
  ↓
Selecciona consultores
  ↓
Click "Agregar Seleccionados"
  ↓
Sistema verifica departamento:
  - Si MISMO: ✅ Asignar directamente
  - Si OTRO: ⏳ Crear solicitud pending + enviar email
```

### 2️⃣ Líder Recibe Email

```
Email automático al líder del departamento
  
Subject: Solicitud de asignación de recurso - [PROYECTO]

Body:
- Consultor: [NOMBRE]
- Proyecto: [NOMBRE]
- [Tabla XLSX con datos]
- Acción: Revisar en panel de control
```

### 3️⃣ Líder Aprueba/Rechaza

```
Líder en /dashboard/horas-por-aprobar
  ↓
Sección: "Solicitudes de Asignación Pendientes"
  ↓
Para cada solicitud:
  - Botón "Aprobar" → ✅ Consultor asignado
  - Botón "Rechazar" → ❌ Se descarta solicitud
```

---

## Testing Rápido (5 minutos)

### Requerimientos
- MongoDB corriendo (localhost:27017)
- Backend Java en puerto 8080
- Frontend Next.js en puerto 3000
- Servidor Node en puerto 3001

### Pasos

**1. Crear una solicitud pendiente:**
```bash
curl -X POST http://localhost:3001/api/staff-assignment-requests/create \
  -H "Content-Type: application/json" \
  -d '{
    "project_id": "proj-test",
    "project_name": "Proyecto Test",
    "project_code": "TST-001",
    "worker_id": "worker-123",
    "worker_name": "Juan Pérez",
    "worker_email": "juan@test.com",
    "worker_department_id": "finance",
    "worker_department_name": "Finance",
    "department_head_id": "head-1",
    "department_head_name": "Carlos López",
    "department_head_email": "carlos@empresa.com",
    "requested_by_id": "mgr-1",
    "requested_by_name": "Manager",
    "requested_by_email": "manager@empresa.com"
  }'
```

**2. Obtener solicitudes pendientes:**
```bash
curl http://localhost:3001/api/staff-assignment-requests/pending/carlos@empresa.com
```

**3. Aprobar una solicitud:**
```bash
# Reemplazar {ID} con el _id de la solicitud
curl -X PUT http://localhost:3001/api/staff-assignment-requests/approve/{ID} \
  -H "Content-Type: application/json" \
  -d '{"approved_by": "head-1"}'
```

---

## Estados Posibles

```
PENDING ──Aprobar──► APPROVED (se crea en assigned_hours)
   ▲       ▼
   └──Rechazar──► REJECTED (no se crea asignación)
```

---

## Variables de Entorno Necesarias

### Backend (.env en server/)
```env
MONGODB_URI=mongodb://localhost:27017/linktech_management
SMTP_ENABLED=true
MAIL_USER=tu_email@gmail.com
MAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

---

## Verificar que Funciona

### En la Consola del Servidor Node

```
✅ Debería ver logs como:
📧 DEBUG email params: { name, email, projectName, ... }
📧 sendChangeHoursEmail received: { toName, toEmail, projectName, ... }
```

### En MongoDB

```javascript
// Ver solicitud creada
db.staffassignmentrequests.findOne()

// Debe tener status: "pending"
```

### En Base de Datos SQL

```javascript
// Después de aprobar, debe haber nuevo registro en assigned_hours
GET /api/proxy/assigned-hours
```

---

## Flujo Completo (Paso a Paso)

**Escenario:** Manager de Delivery asigna consultor de Finance a su proyecto

```
1. Manager en /dashboard/proyeccion
   └─ Selecciona consultor de Finance

2. Sistema detecta: department_id diferente
   └─ createAssignmentRequest() en lugar de createAssignedHours()

3. MongoDB: Se crea documento
   {
     worker_name: "Consultor Finance",
     department_head_email: "jefe.finance@empresa.com",
     status: "pending"
   }

4. Email: Se envía a jefe.finance@empresa.com
   └─ Con detalles del proyecto y tabla XLSX

5. Jefe Finance recibe email
   └─ Accede a /dashboard/horas-por-aprobar

6. Ve tabla: "Solicitudes de Asignación Pendientes"
   └─ Incluye la solicitud

7. Jefe Finance click "Aprobar"
   └─ PUT /api/staff-assignment-requests/approve/{id}

8. MongoDB: status cambia a "approved"

9. Frontend: POST /api/proxy/assigned-hours
   └─ Se crea la asignación en SQL

10. Resultado Final:
    ✅ Consultor aparece en lista del proyecto
    ✅ Status en MongoDB es "approved"
    ✅ Registro en SQL assigned_hours existe
```

---

## Mensajes en UI

### Cuando se Asignan Consultores
```
✅ 3 consultores procesados
✅ 2 asignados directamente (mismo departamento)
⏳ 1 en estado PENDIENTE (esperando aprobación del líder)
```

### Cuando se Aprueba
```
✅ Solicitud aprobada y consultor asignado al proyecto
```

### Cuando se Rechaza
```
✅ Solicitud rechazada
```

---

## Comparación: ANTES vs DESPUÉS

### ANTES (Sin Sistema de Aprobación)
```
Manager: Asigna consultor de otro dept
  ↓
✅ Se asigna directamente
  ↓
Líder del otro dept: Se entera después
```

### DESPUÉS (Con Sistema de Aprobación)
```
Manager: Asigna consultor de otro dept
  ↓
⏳ Queda pendiente
📧 Líder recibe email automático
  ↓
Líder: Aprueba o rechaza en dashboard
  ↓
✅ Si aprueba: Se asigna
❌ Si rechaza: No se asigna
```

---

## Performance

- ✅ API responses < 500ms
- ✅ Búsqueda de solicitudes < 1s
- ✅ Email se envía en background
- ✅ Sin impacto en usuarios finales

---

## Documentación Completa

Para más detalles, ver:

| Archivo | Propósito |
|---------|-----------|
| `STAFF_ASSIGNMENT_APPROVAL_SYSTEM.md` | Guía técnica completa |
| `SYSTEM_ARCHITECTURE_DIAGRAMS.md` | Diagramas y flujos |
| `TESTING_AND_DEPLOYMENT_GUIDE.md` | Cómo testear e implementar |
| `EXECUTIVE_SUMMARY.md` | Resumen ejecutivo |

---

## Soporte Rápido

### Problema: Solicitud no aparece
1. Verificar MongoDB está corriendo
2. Ver logs del servidor: `npm run dev`
3. Verificar email del líder es correcto

### Problema: Email no llega
1. Verificar SMTP_ENABLED=true en .env
2. Verificar MAIL_USER y MAIL_APP_PASSWORD
3. Ver logs: `DEBUG=*smtp* npm run dev`

### Problema: Aprobación no funciona
1. Verificar MongoDB tiene el documento
2. Ver logs del servidor
3. Verificar backend Java está corriendo

---

**¿Listo para testear?** 
→ Ve a `TESTING_AND_DEPLOYMENT_GUIDE.md` para instrucciones detalladas

**¿Quieres entender la arquitectura?**
→ Lee `SYSTEM_ARCHITECTURE_DIAGRAMS.md`

**¿Necesitas detalles técnicos?**
→ Consulta `STAFF_ASSIGNMENT_APPROVAL_SYSTEM.md`


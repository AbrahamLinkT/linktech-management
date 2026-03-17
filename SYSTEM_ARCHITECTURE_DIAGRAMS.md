# Diagrama del Sistema de Aprobación de Asignaciones

## Flujo General

```
┌─────────────────────────────────────────────────────────────────┐
│                    ASIGNACIÓN DE CONSULTORES                     │
└─────────────────────────────────────────────────────────────────┘

                              PROYECCIÓN
                          (handleAgregarSeleccionados)
                                 │
                    ┌────────────┴────────────┐
                    │                         │
        ┌───────────▼──────────┐   ┌──────────▼──────────┐
        │  MISMO DEPARTAMENTO   │   │ OTRO DEPARTAMENTO   │
        │                       │   │                      │
        │  ✅ createAssigned    │   │  ⏳ Crear Solicitud │
        │     Hours()           │   │     Pendiente       │
        │                       │   │                      │
        │  (Asignación Directa) │   │  📧 Enviar Email    │
        │                       │   │     al Líder        │
        └───────────────────────┘   └──────────┬──────────┘
                  │                            │
                  │                    MongoDB
                  │              StaffAssignmentRequest
                  │                   status: pending
                  │
                  ▼
        ┌─────────────────────────┐
        │  assigned_hours (SQL)   │
        │  status: assigned       │
        └─────────────────────────┘
```

## Flujo de Aprobación

```
┌──────────────────────────────────────────────────────────┐
│         HORAS POR APROBAR (Líder del Departamento)        │
└──────────────────────────────────────────────────────────┘

    Solicitudes Pendientes (getPendingRequests)
                       │
            ┌──────────┴──────────┐
            │                     │
        ┌───▼────┐           ┌───▼────┐
        │ Aprobar│           │Rechazar│
        └───┬────┘           └───┬────┘
            │                    │
    ┌───────▼──────────┐    ┌────▼────────────┐
    │ Modal Confirmar  │    │ Input: Motivo   │
    │      (SÍ/NO)     │    │  (Razón)        │
    └───────┬──────────┘    └────┬────────────┘
            │                    │
        ┌───▼────────────┐   ┌───▼──────────┐
        │ approveRequest │   │rejectRequest │
        │ (MongoDB)      │   │ (MongoDB)    │
        └───┬────────────┘   └───┬──────────┘
            │                    │
    ┌───────▼──────────────────┐ │
    │ POST /assigned-hours     │ │
    │ (Crear en SQL)           │ │
    └───────┬──────────────────┘ │
            │                    │
    ┌───────▼──────────┐    ┌────▼────────────┐
    │ ✅ Consultor      │    │ ❌ Solicitud     │
    │    Asignado      │    │    Rechazada    │
    │                  │    │ (No se asigna)  │
    └──────────────────┘    └─────────────────┘
```

## Arquitectura de Bases de Datos

```
┌──────────────────────────────────────────────────────────────┐
│                       MONGODB (Node.js)                       │
├──────────────────────────────────────────────────────────────┤
│                                                                │
│  Collection: staffassignmentrequests                          │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │ {                                                         │ │
│  │   _id: ObjectId,                                          │ │
│  │   project_id: "proj123",                                 │ │
│  │   worker_id: "worker456",                                │ │
│  │   department_head_email: "jefe@empresa.com",             │ │
│  │   status: "pending",                                     │ │
│  │   created_at: ISODate,                                   │ │
│  │   approved_by: null,                                     │ │
│  │   approved_at: null,                                     │ │
│  │   ...                                                     │ │
│  │ }                                                         │ │
│  └─────────────────────────────────────────────────────────┘ │
│                                                                │
└──────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
        ┌───────────▼──────────┐  ┌─────▼──────────────────┐
        │   SQL BACKEND        │  │   ESTADO: assigned     │
        │   (Microservicios)   │  │   (assigned_hours)     │
        │                      │  │                        │
        │ Tables:              │  │ Una vez aprobada la    │
        │ - assigned_hours     │  │ solicitud MongoDB,     │
        │ - workers            │  │ se crea registro       │
        │ - projects           │  │ en SQL                 │
        │ - departments        │  │                        │
        └──────────────────────┘  └────────────────────────┘
```

## Flujo de Emails

```
┌─────────────────────────────────────────────────────────┐
│           SISTEMA DE NOTIFICACIONES POR EMAIL            │
└─────────────────────────────────────────────────────────┘

1. SOLICITUD CREADA
   └─► Proyección/handleAgregarSeleccionados
       └─► createAssignmentRequest()
           └─► fetch POST /api/smtp/send
               └─► 📧 Email al Líder del Departamento
                   Subject: Solicitud de asignación de recurso
                   Cuerpo:
                   - Nombre del consultor
                   - Proyecto destino
                   - Tabla XLSX con datos
                   - Código del proyecto

2. SOLICITUD APROBADA (Opcional - puede agregarse)
   └─► horas-por-aprobar/handleConfirmApprove
       └─► approveRequest()
           └─► Notificar al solicitante (opcional)

3. SOLICITUD RECHAZADA (Opcional - puede agregarse)
   └─► horas-por-aprobar/handleReject
       └─► rejectRequest()
           └─► Notificar al solicitante con motivo (opcional)
```

## Estados y Transiciones

```
                    ┌──────────────┐
                    │ INICIO/DRAFT  │
                    └──────┬───────┘
                           │
                      createAssignment
                      Request()
                           │
                           ▼
                    ┌──────────────┐
                    │   PENDING     │ ◄─── Estado por defecto
                    │  (En espera)  │
                    └──┬──────────┬─┘
                      │          │
            APROBAR   │          │  RECHAZAR
                      │          │
                ┌─────▼──┐   ┌──▼─────┐
                │APPROVED│   │REJECTED│
                │(Activo)│   │(Final) │
                └────────┘   └────────┘
                      │
                CREATE en assigned_hours (SQL)
                      │
                      ▼
                ┌──────────────┐
                │   ASSIGNED   │
                │  (Consultado │
                │ en proyecto) │
                └──────────────┘

Transiciones Permitidas:
pending  ──► approved  (approveRequest)
pending  ──► rejected  (rejectRequest)
pending  ──► [DELETE]  (deleteRequest)
approved ──► [LECTURA SOLO]
rejected ──► [LECTURA SOLO]
```

## Interacción con Usuarios

```
┌────────────────────────────────────────────────────────────┐
│               LÍNEA DE TIEMPO DE USUARIO                     │
└────────────────────────────────────────────────────────────┘

RESPONSABLE DEL PROYECTO (Manager/Líder Proyecto)
│
├─► Accede a: /dashboard/proyeccion
├─► Selecciona: Proyecto y Consultores
├─► Hace click: "Agregar Seleccionados"
│
├─ Para consultores del MISMO departamento:
│  └─► ✅ Se asignan DIRECTAMENTE
│       └─► Aparecen en tabla de proyecto
│
└─ Para consultores de OTRO departamento:
   └─► ⏳ Se crea SOLICITUD PENDIENTE
       └─► Se envía EMAIL al líder del otro departamento


LÍDER DEL DEPARTAMENTO (Department Head)
│
├─► Recibe: EMAIL con solicitud de asignación
├─► Accede a: /dashboard/horas-por-aprobar
├─► Ve: "Solicitudes de Asignación Pendientes"
│
├─ Opción 1: APROBAR
│  └─► 1. Click en "Aprobar"
│      2. Modal de confirmación
│      3. Confirmar acción
│      4. ✅ Consultor asignado al proyecto
│
└─ Opción 2: RECHAZAR
   └─► 1. Click en "Rechazar"
       2. Input de motivo
       3. Confirmar rechazo
       4. ❌ Solicitud rechazada (no se asigna)
```

## Stack Tecnológico

```
FRONTEND
│
├─ Next.js 14+ (React)
│  ├─ src/app/dashboard/proyeccion/page.tsx
│  │  └─ Crear solicitudes de asignación
│  │
│  └─ src/app/dashboard/horas-por-aprobar/page.tsx
│     └─ Aprobar/Rechazar solicitudes
│
├─ Material-UI (MUI)
│  ├─ Modal para confirmación
│  ├─ Button para acciones
│  ├─ Alert para mensajes
│  └─ TextField para razón de rechazo
│
└─ Servicios
   └─ src/services/staffAssignmentService.ts
      └─ Funciones CRUD de solicitudes


BACKEND
│
├─ MongoDB (Node.js/Express)
│  ├─ server/models/StaffAssignmentRequest.js
│  │  └─ Esquema de solicitudes
│  │
│  └─ server/routes/staffAssignmentRequests.js
│     ├─ POST /create
│     ├─ GET /pending/:email
│     ├─ PUT /approve/:id
│     ├─ PUT /reject/:id
│     └─ DELETE /:id
│
├─ Java Microservices (SQL Backend)
│  ├─ POST /assigned-hours
│  │  └─ Crear asignación cuando se aprueba
│  │
│  └─ Tablas SQL
│     ├─ assigned_hours
│     ├─ workers
│     ├─ projects
│     └─ departments


SISTEMAS AUXILIARES
│
├─ Email (nodemailer/SMTP)
│  └─ Notificación al líder cuando se crea solicitud
│
└─ Clerk (Autenticación)
   └─ useUser() para obtener email del líder actual
```

## Flujo de Datos Completo

```
┌─────────────────────────────────────────────────────────────────┐
│                   ASIGNAR CONSULTOR MULTI-DEPT                   │
└─────────────────────────────────────────────────────────────────┘

1. USUARIO SELECCIONA CONSULTOR
   User inputs:
   {
     projectId: "proj123",
     workerId: "worker456",
     departmentId: "dept789"  // Diferente del usuario
   }

2. SISTEMA SEPARA POR DEPARTAMENTO
   Lógica:
   if (worker.department_id === currentUser.department_id)
     // MISMO DEPARTAMENTO
     createAssignedHours(payload)
   else
     // OTRO DEPARTAMENTO
     createAssignmentRequest(payload)
     sendEmail(departmentHead)

3. CREAR SOLICITUD
   MongoDB Query:
   new StaffAssignmentRequest({
     project_id: "proj123",
     worker_id: "worker456",
     worker_name: "Juan Pérez",
     department_head_email: "jefe@empresa.com",
     requested_by_email: currentUser.email,
     status: "pending",
     created_at: Date.now()
   })

4. ENVIAR NOTIFICACIÓN
   Email:
   To: jefe@empresa.com
   Subject: Solicitud de asignación de recurso - Proyecto X
   Body:
   - Consultor: Juan Pérez
   - Proyecto: Proyecto X
   - Código: PRY-001
   - [Tabla XLSX]
   - Action: Ir a Horas por Aprobar

5. LÍDER REVISA SOLICITUD
   GET /api/staff-assignment-requests/pending/jefe@empresa.com
   Respuesta:
   {
     success: true,
     count: 1,
     requests: [
       {
         _id: "...",
         worker_name: "Juan Pérez",
         project_name: "Proyecto X",
         status: "pending"
       }
     ]
   }

6. LÍDER APRUEBA
   PUT /api/staff-assignment-requests/approve/{id}
   Body: { approved_by: "lidera_id" }
   
   Response:
   {
     success: true,
     request: {
       ...,
       status: "approved",
       approved_by: "lidera_id",
       approved_at: Date.now()
     }
   }

7. CREAR ASIGNACIÓN EN SQL
   POST /api/proxy/assigned-hours
   Payload:
   {
     project_id: "proj123",
     assigned_to: "worker456",
     assigned_by: "lidera_id",
     hours_data: {
       monday: 0,
       ...
     }
   }

8. ACTUALIZAR UI
   Frontend:
   - Remover solicitud de tabla pending
   - Mostrar "✅ Solicitud aprobada"
   - Mostrar "Consultor asignado al proyecto"

9. ESTADO FINAL
   Consultor aparece en:
   ✅ Tabla de assigned_hours (SQL)
   ✅ Lista de consultores del proyecto
   ✅ Reportes de asignación
```


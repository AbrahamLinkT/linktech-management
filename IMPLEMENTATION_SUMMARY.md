# Implementación: Sistema de Autorización por Departamento para Asignación de Workers

## Resumen Ejecutivo

Se ha implementado un sistema completo de **autorización basada en departamentos** para la asignación de trabajadores a proyectos, con **notificaciones automáticas por email** cuando se asignan trabajadores de otros departamentos.

### Características Principales
✅ Solo el responsable/líder del proyecto puede agregar workers  
✅ Sin notificación para workers del mismo departamento  
✅ Notificación automática con XLSX para workers de otros departamentos  
✅ Manejo robusto de errores  
✅ Logging detallado para debugging  

---

## Cambios Implementados

### 1. Archivo: `src/app/dashboard/proyeccion/page.tsx`

#### Función: `generateWorkerXLSX(selectedWorkers)`
Genera un archivo XLSX con información del trabajador.

**Ubicación:** Líneas 428-445  
**Entrada:** Array de workers  
**Salida:** Blob de XLSX  

**Contenido del XLSX:**
- Nombre
- Email
- Departamento
- Rol
- Nivel
- Ubicación
- Fecha de Contratación
- Código de Empleado

**Errores:** Se capturan y registran en consola, sin interrumpir el flujo

---

#### Función: `findDepartmentHead(workerDepartmentId)`
Busca el líder del departamento especificado para enviarle notificaciones.

**Ubicación:** Líneas 448-470  
**Entrada:** `department_id` del worker  
**Salida:** `{ id, email, name }` del líder o `null`  

**Lógica:**
1. Filtra workers por `department_id`
2. Busca un worker con rol que contenga: "jefe", "líder", "head" o "manager"
3. Retorna el primer coincidente o `null`

**Nota:** Mejora futura: usar campo `department_head_id` para mayor precisión

---

#### Función: `handleAgregarSeleccionados()` (REFACTORIZADA)
Orquesta todo el flujo de autorización, separación y notificación.

**Ubicación:** Líneas 473-650

**Flujo detallado:**

1. **Validaciones iniciales**
   - Verificar workers seleccionados
   - Verificar proyecto seleccionado
   - Obtener proyecto de la lista

2. **Autenticación**
   - Obtener email del usuario actual (Clerk)
   - Buscar worker asociado a ese email
   - Verificar que el usuario existe en el sistema

3. **Autorización** ⭐ CRÍTICA
   ```typescript
   if (creator.id !== project.employee_id) {
     alert(`⛔ No tienes permiso...`);
     return;
   }
   ```
   Solo el `employee_id` del proyecto (responsable) puede agregar

4. **Separación por departamento**
   ```typescript
   const sameDeptWorkers = selectedWorkers.filter(w => 
     w.department_id === creatorDepartmentId
   );
   const diffDeptWorkers = selectedWorkers.filter(w => 
     w.department_id !== creatorDepartmentId
   );
   ```

5. **Creación de asignaciones**
   - Crea payload para TODOS los workers
   - Llamada única a `createAssignedHours(payload)`
   - Sin diferenciación en la BD (el email es posterior)

6. **Notificaciones por departamento**
   - **Para cada `diffDeptWorker`:**
     - Generar XLSX individual
     - Encontrar líder del departamento
     - Convertir XLSX a base64
     - Enviar POST a `/api/smtp/send` con FormData
   - **Para cada `sameDeptWorker`:**
     - Nada (sin email)

7. **Confirmación**
   - Mensaje personalizado según cantidad y departamentos
   - Recarga de datos del proyecto
   - Limpieza de selección del modal

---

## Variables de Entorno Requeridas

Para habilitar las notificaciones por email:

```bash
# En .env.local o .env.production
SMTP_ENABLED=true                          # Feature flag
SMTP_API_KEY=<opcional-para-autenticacion> # X-API-Key header
MAIL_USER=tu-email@gmail.com              # Remitente SMTP
MAIL_APP_PASSWORD=<app-password-16-chars> # Gmail App Password
```

---

## Endpoint SMTP Utilizado

**Ruta:** `/api/smtp/send` (POST)  
**Tipo de Contenido:** `multipart/form-data`  

**Parámetros:**
```typescript
formData.append('email', departmentHead.email);        // Destinatario
formData.append('name', departmentHead.name);          // Nombre del destinatario
formData.append('message', emailBody);                 // Cuerpo del email
formData.append('xlsxBase64', base64EncodedXLSX);     // XLSX en base64
```

**Ejemplo de email generado:**
```
Destinatario: jose@empresa.com
Nombre: José García
Cuerpo: Se ha asignado a Lupita García (lupita@empresa.com) del departamento Finanzas al proyecto Innovación 2024 por Juan Pérez.
Adjunto: XLSX con datos de Lupita
```

---

## Flujos de Uso

### Flujo 1: Agregar Worker del Mismo Departamento
```
Juan (Innovación) → Agregar Carlos (Innovación)
↓
✅ Carlos agregado al proyecto
📌 Sin email (mismo departamento)
```

### Flujo 2: Agregar Worker de Otro Departamento
```
Juan (Innovación) → Agregar Lupita (Finanzas)
↓
✅ Lupita agregada al proyecto
📧 Email enviado a José (Jefe de Finanzas)
📎 Con XLSX de Lupita adjunto
```

### Flujo 3: Sin Autorización
```
María (Empleado) → Intenta agregar a Proyecto X (Juan es responsable)
↓
❌ Acceso denegado: "No tienes permiso para agregar personal..."
```

### Flujo 4: Múltiples Workers (Mixto)
```
Juan → Agregar [Carlos (Innov), Ana (Innov), Lupita (Finanzas), Luis (RH)]
↓
✅ 4 agregados
📌 2 del mismo departamento (sin email)
📧 2 emails (Jefe de Finanzas + Jefe de RH)
```

---

## Validaciones y Errores

| Validación | Mensaje |
|---|---|
| Sin workers seleccionados | "Por favor selecciona al menos un consultor" |
| Sin proyecto seleccionado | "Por favor selecciona un proyecto primero" |
| Usuario no autenticado | "No se pudo obtener la sesión de usuario (Clerk)" |
| Worker sin email en sistema | "No se encontró un trabajador con tu email" |
| No es responsable del proyecto | "⛔ No tienes permiso para agregar personal..." |
| Error generando XLSX | Se registra en consola, continúa el flujo |
| Error enviando email | Se registra en consola, continúa el flujo |
| Líder de departamento no existe | Se omite email para ese worker |

---

## Logging y Debugging

### En Console del Navegador (DevTools)
```typescript
// Logs automáticos generados:
console.log('✅ Creando asignaciones:', payload);          // Antes de crear
console.log('✅ Email enviado exitosamente a...', email);  // Success
console.error('Error enviando email a...', err);           // Error
console.error('Error leyendo XLSX blob');                  // Error XLSX
console.warn('Email enviado con estado...', status);       // Respuesta no OK
```

### En el Servidor
Se registran todos los emails enviados a través del endpoint `/api/smtp/send`

---

## Integración con Sistemas Existentes

### Dependencias Utilizadas
- ✅ `xlsx` (ya instalado en package.json)
- ✅ `@clerk/nextjs` (para autenticación)
- ✅ Endpoint `/api/smtp/send` (ya implementado)
- ✅ Hook `useWorkers` (workers con department_id)
- ✅ Hook `useProjects` (projects con employee_id)
- ✅ Hook `useAssignedHours` (createAssignedHours)

### No Se Agregó Código Adicional a
- Backend (usa endpoint SMTP existente)
- Hooks (se reutilizan existentes)
- Estilos (usa alerts del navegador, puede mejorarse)

---

## Mejoras Futuras

### Corto Plazo
1. **Reemplazar alerts con Toasts**
   - Migrar de `alert()` a componente Toast (MUI Snackbar)
   - Mostrar notificaciones no invasivas

2. **Campo `department_head_id` en Workers**
   - Eliminar búsqueda por rol
   - Mayor precisión y velocidad

3. **Tabla de Auditoría**
   - Guardar `{ worker_id, assigned_to, email_sent, timestamp }`
   - Histórico de asignaciones

### Mediano Plazo
1. **Templates de Email HTML**
   - Permitir personalización del email
   - Plantillas por departamento

2. **Dashboard para Líderes**
   - Ver workers asignados a sus departamentos
   - Aprobar/rechazar asignaciones

3. **Aprobaciones en Email**
   - Links de aprobación en el email
   - Callback a API para registrar aprobación

### Largo Plazo
1. **Workflow de Aprobación**
   - Asignación → Pendiente aprobación del líder
   - Aprobado → Se habilitan horas para proyecto

2. **Notificaciones en UI**
   - Centro de notificaciones para líderes
   - Badges de asignaciones pendientes

3. **Reportes de Asignaciones**
   - Por departamento
   - Por mes/trimestre
   - Cross-department assignments tracking

---

## Validación de Implementación

### Checklist Completado ✅

- [x] Verificación de autorización (solo responsable)
- [x] Separación de workers por departamento
- [x] Generación de XLSX con datos del worker
- [x] Búsqueda de líder del departamento
- [x] Envío de email con XLSX para otros departamentos
- [x] Sin email para mismo departamento
- [x] Mensaje diferenciado en confirmación
- [x] Manejo robusto de promesas async/await
- [x] Conversión de Blob a base64
- [x] Logging detallado para debugging
- [x] Integración con endpoint SMTP existente
- [x] Validaciones de entrada

### Tests Recomendados

Ver archivo `DEPARTMENT_AUTH_TESTING.md` para:
- Test 1: Verificar autorización bloqueada
- Test 2: Agregar worker del mismo departamento
- Test 3: Agregar worker de otro departamento
- Test 4: Múltiples workers mixtos
- Test 5: Líder de departamento no encontrado

---

## Documentación Asociada

1. **DEPARTMENT_AUTHORIZATION.md**
   - Descripción general del sistema
   - Componentes clave
   - Casos de uso

2. **DEPARTMENT_AUTH_TESTING.md**
   - Guía de testing
   - Escenarios de prueba
   - Troubleshooting
   - Datos de prueba recomendados

3. **Este archivo (IMPLEMENTATION_SUMMARY.md)**
   - Resumen de cambios
   - Integración con sistemas existentes
   - Mejoras futuras

---

## Contacto y Preguntas

Para preguntas sobre la implementación:
1. Revisa los logs en DevTools Console
2. Verifica DEPARTMENT_AUTHORIZATION.md para lógica
3. Verifica DEPARTMENT_AUTH_TESTING.md para ejemplos
4. Busca `// ==================== SECCIÓN ====================` en código para hallazgos rápidos

---

**Última actualización:** 2024  
**Estado:** ✅ Implementado y listo para testing

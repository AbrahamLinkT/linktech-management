# Sistema de Autorización por Departamento para Asignación de Workers

## Descripción General
Implementa un sistema de control de acceso y notificación para agregar trabajadores a proyectos, basado en departamentos.

## Flujo de Lógica

### 1. Verificación de Autorización
Solo el **responsable/líder del proyecto** (`project.employee_id`) puede agregar trabajadores.

```typescript
if (creator.id !== project.employee_id) {
  alert(`⛔ No tienes permiso para agregar personal a este proyecto.`);
  return;
}
```

### 2. Separación por Departamento
Se dividen los trabajadores seleccionados en dos grupos:

- **`sameDeptWorkers`**: Trabajadores del mismo departamento del responsable
- **`diffDeptWorkers`**: Trabajadores de otros departamentos

```typescript
const sameDeptWorkers = selectedWorkers.filter(w => w.department_id === creatorDepartmentId);
const diffDeptWorkers = selectedWorkers.filter(w => w.department_id !== creatorDepartmentId);
```

### 3. Adición a Proyecto
Todos los trabajadores se agregan al proyecto mediante `createAssignedHours()`.

### 4. Notificación Condicional
**Para trabajadores de otros departamentos:**
1. Se genera un archivo XLSX con los datos del trabajador
2. Se busca el líder del departamento del trabajador
3. Se envía un email al líder con el XLSX adjunto

**Para trabajadores del mismo departamento:**
- Se agregan sin notificación

## Componentes Clave

### `generateWorkerXLSX(selectedWorkers)`
Genera un archivo XLSX con información del trabajador:
- Nombre
- Email
- Departamento
- Rol
- Nivel
- Ubicación
- Fecha de Contratación
- Código de Empleado

**Entrada:** Array de workers  
**Salida:** Blob de XLSX

### `findDepartmentHead(workerDepartmentId)`
Busca el líder del departamento especificado:
- Filtra workers que tengan `department_id` coincidente
- Busca un worker con rol que contenga "jefe", "líder", "head" o "manager"
- Retorna: `{ id, email, name }`

**Entrada:** `department_id` del worker  
**Salida:** Objeto con datos del líder o `null`

### `handleAgregarSeleccionados()`
Orquesta todo el flujo:
1. Obtiene workers seleccionados
2. Valida que exista proyecto seleccionado
3. Verifica autorización del usuario
4. Separa workers por departamento
5. Agrega todos los workers al proyecto
6. Para `diffDeptWorkers`, genera XLSX y envía email

## Notificación por Email

### Estructura del Email
- **Destinatario:** Email del líder del departamento
- **Asunto:** Generado automáticamente (no personalizable en esta versión)
- **Cuerpo:** Mensaje que incluye:
  - Nombre del trabajador asignado
  - Email del trabajador
  - Departamento del trabajador
  - Nombre del proyecto
  - Nombre del responsable que asignó
- **Adjunto:** XLSX con datos del trabajador

### Endpoint SMTP
**Ruta:** `/api/smtp/send` (POST)  
**Tipo de contenido:** `multipart/form-data`

**Parámetros requeridos:**
- `email`: Email del destinatario (líder del departamento)
- `name`: Nombre del destinatario
- `message`: Cuerpo del mensaje
- `xlsxBase64`: Archivo XLSX en base64

**Requisitos de Configuración:**
```bash
SMTP_ENABLED=true
SMTP_API_KEY=<opcional>
MAIL_USER=<tu-email@gmail.com>
MAIL_APP_PASSWORD=<app-password>
```

## Ejemplo de Caso de Uso

### Escenario 1: Mismo Departamento
- **Juan Pérez** (Departamento: Innovación) agrega a **Carlos** (Departamento: Innovación)
- ✅ Carlos se agrega al proyecto
- 📌 **No se envía notificación**

### Escenario 2: Diferente Departamento
- **Juan Pérez** (Departamento: Innovación, líder) agrega a **Lupita** (Departamento: Finanzas)
- ✅ Lupita se agrega al proyecto
- 📧 Se envía email a **José García** (Líder de Finanzas)
- 📎 El email incluye XLSX con datos de Lupita

### Escenario 3: Sin Permiso
- **María** (Empleado regular) intenta agregar un worker
- ❌ Acceso denegado: "No tienes permiso para agregar personal a este proyecto"

## Errores y Validaciones

| Validación | Mensaje |
|---|---|
| Sin workers seleccionados | "Por favor selecciona al menos un consultor" |
| Sin proyecto seleccionado | "Por favor selecciona un proyecto primero" |
| Usuario no autenticado | "No se pudo obtener la sesión de usuario" |
| Usuario sin worker asociado | "No se encontró un trabajador con tu email" |
| No es responsable del proyecto | "No tienes permiso para agregar personal a este proyecto" |
| Líder de departamento no encontrado | Se omite el envío de email para ese worker |
| Error generando XLSX | Se registra en consola, pero continúa el flujo |
| Error enviando email | Se registra en consola, pero continúa el flujo |

## Flujo de Confirmación

Después de agregar workers, el usuario verá un mensaje que incluye:
```
✅ X consultor(es) agregado(s) exitosamente
📌 Y del mismo departamento (sin notificación)
📧 Z de otros departamentos (notificados)
```

## Consideraciones de Implementación

### Identificación del Líder de Departamento
Actualmente se busca un worker que:
1. Pertenezca al departamento del worker a notificar
2. Tenga un rol que contenga: "jefe", "líder", "head" o "manager"

**Mejoras futuras:** Usar un campo `is_department_head` o `department_head_id` en la tabla de workers.

### Manejo de Errores
- Los errores de generación de XLSX no detienen el flujo
- Los errores de envío de email no detienen el flujo
- Se registran todos en `console.error()` para debugging

### Seguridad
- SMTP endpoint requiere `SMTP_ENABLED=true`
- SMTP endpoint requiere `X-API-Key` si está configurada
- Los emails son enviados solo a direcciones asociadas con líderes de departamento en el sistema

## Próximos Pasos

1. **Persistencia de Logs:** Guardar registro de notificaciones enviadas
2. **Dashboard para Líderes:** Mostrar trabajadores asignados pendientes de aprobación
3. **Templates de Email:** Permitir personalización del email
4. **Auditoría:** Registrar quién asignó a quién y cuándo
5. **Aprobaciones:** Permitir que los líderes de departamento aprueben/rechacen asignaciones

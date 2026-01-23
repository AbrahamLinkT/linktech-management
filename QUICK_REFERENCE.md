# Quick Reference: Sistema de Autorización por Departamento

## 🚀 Inicio Rápido

### Requisitos
```bash
SMTP_ENABLED=true
MAIL_USER=tu-email@gmail.com
MAIL_APP_PASSWORD=<app-password>
```

### ¿Qué sucede cuando un responsable agrega un worker?

```
1️⃣ Verificar: ¿Es el responsable del proyecto?
   ❌ NO → Bloquear con error
   ✅ SÍ → Continuar

2️⃣ Separar workers en 2 grupos:
   📌 Mismo departamento (sin email)
   📧 Otro departamento (enviar email)

3️⃣ Agregar TODOS los workers al proyecto

4️⃣ Para workers de otro departamento:
   • Generar XLSX con datos del worker
   • Buscar líder del departamento
   • Enviar email con XLSX adjunto

5️⃣ Mostrar confirmación con detalles
```

---

## 📋 Checklist de Funcionalidad

| Característica | Ubicación | Estado |
|---|---|---|
| Autorización | `handleAgregarSeleccionados()` línea 480-525 | ✅ Implementado |
| Generación XLSX | `generateWorkerXLSX()` línea 428-445 | ✅ Implementado |
| Búsqueda de líder | `findDepartmentHead()` línea 448-470 | ✅ Implementado |
| Envío de email | `handleAgregarSeleccionados()` línea 555-605 | ✅ Implementado |
| Confirmación | `handleAgregarSeleccionados()` línea 607-615 | ✅ Implementado |

---

## 🔧 Configuración Requerida

### Variables de Entorno (.env.local)
```bash
# Feature flag
SMTP_ENABLED=true

# Credenciales SMTP (Gmail)
MAIL_USER=notificaciones@empresa.com
MAIL_APP_PASSWORD=abcd efgh ijkl mnop  # 16 caracteres

# Opcional: Autenticación en endpoint
SMTP_API_KEY=mi-api-key-secreto
```

### Datos de Base de Datos
- Workers con `department_id` (requerido)
- Workers con `email` (requerido para líder)
- Proyectos con `employee_id` (responsable)
- Un worker por departamento con rol "Jefe", "Líder", "Head" o "Manager"

---

## 🧪 Tests Rápidos

### Test 1: Autorización
```typescript
// Juan (responsable) → agregar Carlos ✅
// María (empleado) → agregar a proyecto de Juan ❌
Resultado: Maria ve "No tienes permiso..."
```

### Test 2: Mismo Departamento
```typescript
// Juan (Innovación) → Agregar Carlos (Innovación)
Resultado: "1 del mismo departamento (sin notificación)"
```

### Test 3: Otro Departamento
```typescript
// Juan (Innovación) → Agregar Lupita (Finanzas)
Resultado: "1 de otros departamentos (notificados)"
         + Email en inbox de Jefe de Finanzas
```

---

## 📊 Estructura de Datos

### Worker (en memoria)
```typescript
{
  id: 1,
  name: "Juan Pérez",
  email: "juan@empresa.com",
  department_id: 1,           // ⭐ Requerido
  departmentName: "Innovación",
  roleName: "Jefe de Innovación"  // ⭐ Debe contener "Jefe"
}
```

### Project (en memoria)
```typescript
{
  project_id: 1,
  project_name: "Proyecto A",
  employee_id: 1,    // ⭐ Responsable (Juan)
  department_id: 1
}
```

### Email Enviado
```
TO: jose@empresa.com (Jefe de Finanzas)
NAME: José García
MESSAGE: "Se ha asignado a Lupita García (lupita@empresa.com) 
          del departamento Finanzas al proyecto Innovación 2024 
          por Juan Pérez."
ATTACHMENT: XLSX con datos de Lupita
```

---

## 🔍 Debugging Rápido

### Verificar Autorización
```typescript
// En DevTools Console:
console.log('creator.id:', creator.id);           // ID del usuario
console.log('project.employee_id:', project.employee_id);  // ID del responsable
// Deben ser iguales para que funcione
```

### Verificar Líder Encontrado
```typescript
// En DevTools Console:
console.log('departmentHead:', departmentHead);
// Resultado esperado: { id: 2, email: "jose@...", name: "José" }
// Si es null: el líder no existe o no tiene "Jefe" en el rol
```

### Verificar SMTP
```bash
# Desde terminal:
echo $SMTP_ENABLED        # Debe ser: true
echo $MAIL_USER           # Debe ser: un email válido
echo $MAIL_APP_PASSWORD   # Debe ser: 16 caracteres
```

---

## 🚨 Errores Comunes y Soluciones

| Error | Causa | Solución |
|---|---|---|
| "No tienes permiso..." | No eres responsable del proyecto | Usa cuenta del responsable |
| "No se encontró un trabajador con tu email" | Tu email no está en sistema | Añade tu email al worker |
| SMTP deshabilitado | SMTP_ENABLED ≠ true | Configura en .env.local |
| Email no recibido | Líder sin email o rol sin "Jefe" | Verifica worker en BD |
| XLSX no se genera | Dependencia xlsx no instalada | `npm install xlsx` |

---

## 📁 Archivos Modificados

```
src/app/dashboard/proyeccion/page.tsx
├── generateWorkerXLSX()           [NUEVA]
├── findDepartmentHead()            [NUEVA]
└── handleAgregarSeleccionados()   [REFACTORIZADO]
```

### Funciones Nuevas
- **generateWorkerXLSX()**: Líneas 428-445
- **findDepartmentHead()**: Líneas 448-470

### Funciones Modificadas
- **handleAgregarSeleccionados()**: Líneas 473-650 (antes: ~100 líneas)

---

## 🔄 Flujo de Autorización Detallado

```
┌─────────────────────────────────────┐
│ Usuario selecciona workers          │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ ¿Existe proyecto seleccionado?      │
└────────────┬────────────┬───────────┘
             │            │
          SÍ │            │ NO
             │            └─────► ERROR: "Selecciona proyecto"
             ▼
┌─────────────────────────────────────┐
│ ¿Usuario autenticado en Clerk?      │
└────────────┬────────────┬───────────┘
             │            │
          SÍ │            │ NO
             │            └─────► ERROR: "Inicia sesión"
             ▼
┌─────────────────────────────────────┐
│ ¿Worker existe en BD?               │
└────────────┬────────────┬───────────┘
             │            │
          SÍ │            │ NO
             │            └─────► ERROR: "No encontrado"
             ▼
┌─────────────────────────────────────┐
│ ¿Es responsable del proyecto?       │ ⭐ CRÍTICA
└────────────┬────────────┬───────────┘
             │            │
          SÍ │            │ NO
             │            └─────► ERROR: "No tienes permiso"
             ▼
┌─────────────────────────────────────┐
│ Separar por departamento:           │
│ • Mismo departamento (grupo A)      │
│ • Otro departamento (grupo B)       │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Agregar TODOS al proyecto           │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Para cada worker en grupo B:        │
│ • Generar XLSX                      │
│ • Buscar líder del departamento     │
│ • Enviar email con XLSX             │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│ Mostrar confirmación                │
│ "X agregados: Y mismo dept, Z otros"│
└─────────────────────────────────────┘
```

---

## 📞 Soporte

Para más información, consulta:
- `DEPARTMENT_AUTHORIZATION.md` - Descripción detallada del sistema
- `DEPARTMENT_AUTH_TESTING.md` - Casos de prueba y debugging
- `IMPLEMENTATION_SUMMARY.md` - Resumen técnico completo

---

**Última actualización:** 2024  
**Versión:** 1.0  
**Estado:** ✅ Producción-Ready

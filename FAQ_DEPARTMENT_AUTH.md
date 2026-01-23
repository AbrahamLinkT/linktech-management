# FAQ: Sistema de Autorización por Departamento

## Preguntas Frecuentes

### 1. ¿Quién puede agregar workers a un proyecto?

**R:** Solo el **responsable/líder del proyecto** (`project.employee_id`) puede agregar workers a ese proyecto.

Si intentas agregar como usuario que no es responsable, verás:
```
⛔ No tienes permiso para agregar personal a este proyecto. 
Solo el responsable puede hacerlo.
```

---

### 2. ¿Qué sucede si agrego un worker del mismo departamento?

**R:** Se agrega sin problemas y **sin enviar ningún email**.

**Ejemplo:**
- Juan (Jefe de Innovación) agrega a Carlos (también de Innovación)
- ✅ Carlos aparece inmediatamente en la tabla
- 📭 No hay notificación por email

---

### 3. ¿Qué sucede si agrego un worker de otro departamento?

**R:** Se agrega el worker Y se envía un email automático al líder del departamento del worker, con un archivo XLSX adjunto.

**Ejemplo:**
- Juan (Innovación) agrega a Lupita (Finanzas)
- ✅ Lupita aparece en la tabla
- 📧 José García (Jefe de Finanzas) recibe un email con:
  - Información de la asignación
  - XLSX con datos de Lupita

---

### 4. ¿Cómo se identifica al "líder del departamento"?

**R:** El sistema busca el primer worker del departamento que tenga en su rol una de estas palabras:
- "jefe"
- "líder"
- "head"
- "manager"

**Ejemplos de roles que funcionan:**
- ✅ "Jefe de Finanzas"
- ✅ "Líder de Departamento"
- ✅ "Head of Operations"
- ✅ "Department Manager"

**Ejemplos que NO funcionan:**
- ❌ "Contador" (sin "jefe")
- ❌ "Consultor Senior"
- ❌ "Empleado Regular"

---

### 5. ¿Qué pasa si no existe un líder para el departamento?

**R:** El worker se agrega normalmente, pero no se envía email.

Se registra en la consola:
```
console.warn: "Líder del departamento no encontrado para dept_id: X"
```

**Solución:** Actualiza el rol del departamento manager para que contenga "Jefe" o "Líder".

---

### 6. ¿Qué contiene el XLSX que se envía?

**R:** Un archivo Excel con esta información del worker:

| Campo | Ejemplo |
|---|---|
| Nombre | Lupita García |
| Email | lupita@empresa.com |
| Departamento | Finanzas |
| Rol | Contadora |
| Nivel | Senior |
| Ubicación | CDMX |
| Fecha de Contratación | 2022-01-15 |
| Código de Empleado | EMP-0042 |

---

### 7. ¿Cuál es el contenido del email enviado?

**R:** El email incluye:

**Destinatario:** Email del líder del departamento  
**Asunto:** No personalizable (generado por el sistema)  
**Cuerpo:**
```
Se ha asignado a [nombre del worker] ([email del worker]) 
del departamento [nombre del departamento] 
al proyecto [nombre del proyecto] 
por [nombre de quien asignó].
```

**Adjunto:** XLSX con datos del worker

---

### 8. ¿Puedo cambiar el contenido del email?

**R:** Actualmente **NO**, está hardcodeado en el código.

Para futuras versiones, se planea:
- Template de email HTML personalizable
- Variables dinámicas
- Opciones por departamento

**Contacta al equipo de desarrollo si necesitas cambios urgentes.**

---

### 9. ¿Qué pasa si mi email no está registrado en el sistema?

**R:** Verás este error:
```
No se encontró un trabajador con tu email en el sistema. 
Verifica que tu usuario tenga un worker con ese email.
```

**Solución:**
1. Contacta al administrador
2. Verifica que tu usuario en Clerk tiene el email correcto
3. Verifica que existe un worker en BD con ese email

---

### 10. ¿Qué pasa si el email no se envía?

**R:** 
- El worker se agrega normalmente ✅
- Se registra un error en la consola del navegador (DevTools)
- El usuario ve un mensaje de confirmación con cantidad de notificaciones

**Por qué puede fallar el email:**
- SMTP_ENABLED=false
- MAIL_USER o MAIL_APP_PASSWORD incorrectos
- Email del líder es vacío
- Servidor SMTP rechaza la conexión

**Para debugging:**
```
Abre DevTools (F12) → Console → busca mensajes con "Email"
```

---

### 11. ¿Se pueden agregar múltiples workers simultáneamente?

**R:** **SÍ**, puedes seleccionar varios workers y agregarlos todos de una vez.

**Ejemplo:**
- Seleccionar: 3 de Innovación + 2 de Finanzas + 1 de RRHH
- Click en "Agregar Seleccionados"
- Resultado:
  ```
  ✅ 6 consultor(es) agregado(s) exitosamente
  📌 3 del mismo departamento (sin notificación)
  📧 3 de otros departamentos (notificados)
  ```
- Se envían 2 emails (uno al Jefe de Finanzas, otro al de RRHH)

---

### 12. ¿Cómo debugging si algo sale mal?

**R:** Abre DevTools y busca en la consola:

```javascript
// Logs de éxito
"✅ Email enviado exitosamente a..."
"✅ Creando asignaciones:"

// Logs de error
"❌ Error enviando email a..."
"Error leyendo XLSX blob"
"Error convirtiendo XLSX a base64:"

// Logs de autorización
"⛔ No tienes permiso..."
```

---

### 13. ¿Qué variables de entorno necesito?

**R:** Para que funcione completamente, necesitas:

```bash
# REQUERIDO para notificaciones
SMTP_ENABLED=true
MAIL_USER=tu-email@gmail.com
MAIL_APP_PASSWORD=abcd efgh ijkl mnop

# OPCIONAL (para autenticación del endpoint)
SMTP_API_KEY=mi-clave-secreta
```

Si faltan estas variables:
- La función igual funciona para agregar workers
- Los emails NO se envían
- No hay errores de compilación (sin definiciones estrictas)

---

### 14. ¿Es seguro que el email llegue al departamento correcto?

**R:** Depende de varios factores:

✅ **Seguro si:**
- El líder tiene un email válido en la BD
- Su rol contiene "Jefe" o "Líder"
- SMTP está configurado correctamente

⚠️ **Riesgos potenciales:**
- Si hay múltiples "Jefes" en un departamento, se usa el primero
- Si el rol no contiene "Jefe", no se encuentra al líder
- Si el email es incorrecto, falla silenciosamente

**Mejora futura:** Campo `department_head_id` para identificación precisa

---

### 15. ¿Se puede rechazar una asignación desde el email?

**R:** **NO**, actualmente no hay funcionalidad de rechazo.

El email es **solo informativo** y **no tiene links interactivos**.

**Para futuras versiones:**
- Links en el email para aprobar/rechazar
- Callback a la API para registrar la decisión
- Dashboard para gestionar asignaciones

---

### 16. ¿Dónde se registran las asignaciones?

**R:** En la tabla `assigned_hours` con los campos:
- `project_id`
- `assigned_to` (worker ID)
- `assigned_by` (responsable)
- `hours_data` (vacío inicialmente)
- `created_at` (timestamp)

**No hay tabla de auditoría de emails** (mejora futura).

---

### 17. ¿Qué pasa si fallo la contraseña de Gmail?

**R:** 
- **Compilación:** Sin error (no hay validación en build time)
- **Runtime:** El email falla silenciosamente
- **Log:** "Error enviando email..." en consola
- **Usuarios:** Ven "workers agregados" pero sin email

**Solución:**
1. Genera una App Password de Gmail: https://myaccount.google.com/apppasswords
2. Actualiza `MAIL_APP_PASSWORD` en .env.local
3. Reinicia el servidor (`npm run dev` o redeploy)

---

### 18. ¿Puedo cambiar los roles que identifican al "Jefe"?

**R:** Actualmente **NO**, está en código (`findDepartmentHead()`).

Para cambiar, modifica esta línea en `proyeccion/page.tsx`:
```typescript
(w.roleName?.toLowerCase().includes('jefe') ||  // Cambia aquí
 w.roleName?.toLowerCase().includes('líder') ||
 w.roleName?.toLowerCase().includes('head') ||
 w.roleName?.toLowerCase().includes('manager'))
```

**Mejor solución:** Usar `department_head_id` en la BD (próxima versión).

---

### 19. ¿Es reversible agregar un worker?

**R:** **Sí**, usando el botón "Eliminar" en la tabla (si existe).

Cuando eliminas una asignación:
- Se borra de `assigned_hours`
- No hay email de notificación
- El worker vuelve a estar disponible para asignar

**Nota:** Esto no deshace el email ya enviado al líder del departamento.

---

### 20. ¿Cómo sé si la implementación funciona correctamente?

**R:** Realiza estos tests:

1. **Test de Autorización**
   - Login como empleado NO responsable
   - Intenta agregar worker
   - Esperado: ❌ Error "No tienes permiso"

2. **Test de Mismo Departamento**
   - Login como responsable de Innovación
   - Agrega otro worker de Innovación
   - Esperado: ✅ "Sin notificación"

3. **Test de Otro Departamento**
   - Login como responsable
   - Agrega worker de otro departamento
   - Esperado: 📧 Email en inbox del líder

4. **Test de SMTP Deshabilitado**
   - Set `SMTP_ENABLED=false`
   - Agrega worker de otro departamento
   - Esperado: ✅ Se agrega, pero no hay email

Para más detalles, ver `DEPARTMENT_AUTH_TESTING.md`.

---

## Preguntas Técnicas Avanzadas

### P21: ¿Qué pasa con la información del Clerk user?

**R:** Se obtiene de dos formas (en orden):
```typescript
const currentEmail = user?.primaryEmailAddress?.emailAddress || 
                   user?.emailAddresses?.[0]?.emailAddress;
```

Solo se usa el email, no el full name (se obtiene del worker en BD).

---

### P22: ¿Cómo se genera el XLSX en el navegador?

**R:** Usa la librería `xlsx` instalada:
1. Convierte workers a array de objetos
2. Crea hoja con `json_to_sheet()`
3. Crea workbook con `book_new()`
4. Convierte a Blob con `write()`
5. Lee Blob como base64 con `FileReader`

Todo sucede **en el navegador**, no en el servidor.

---

### P23: ¿Por qué se usan FormData y no JSON?

**R:** El endpoint `/api/smtp/send` espera:
- `multipart/form-data` con campo `xlsxBase64`

O podrías enviar JSON con:
```json
{
  "email": "jefe@empresa.com",
  "name": "José García",
  "message": "...",
  "xlsxBase64": "<base64 del xlsx>"
}
```

La implementación actual usa FormData.

---

### P24: ¿Hay timeout en el envío de emails?

**R:** No, pero `fetch()` por defecto tiene timeout implícito del navegador (~30s).

Para timeout explícito, se podría usar:
```typescript
AbortController para implementar timeout manual
```

---

### P25: ¿Se pueden enviar emails en paralelo?

**R:** **SÍ**, se usa `Promise.all()`:
```typescript
await Promise.all(emailPromises);
```

Todos los emails se envían simultáneamente (no secuencialmente).

---

## Conclusión

Para más información detallada, consulta:
- **DEPARTMENT_AUTHORIZATION.md** - Lógica del sistema
- **DEPARTMENT_AUTH_TESTING.md** - Casos de prueba
- **IMPLEMENTATION_SUMMARY.md** - Resumen técnico
- **QUICK_REFERENCE.md** - Referencia rápida

# Guía de Testing: Sistema de Autorización de Departamentos

## Configuración de Entorno

Para que el sistema de notificación por email funcione correctamente, asegúrate de tener estas variables configuradas en `.env.local`:

```bash
# SMTP Configuration (requerido para notificaciones)
SMTP_ENABLED=true
SMTP_API_KEY=<tu-api-key-opcional>  # Solo si quieres autenticación
MAIL_USER=tu-email@gmail.com
MAIL_APP_PASSWORD=tu-app-password-de-16-caracteres
```

### Para Gmail:
1. Habilita "Less secure apps" o usa "App Passwords"
2. Obtén una "App Password" (16 caracteres) desde https://myaccount.google.com/apppasswords
3. Usa ese password como `MAIL_APP_PASSWORD`

## Escenarios de Prueba

### Test 1: Verificar Autorización (BLOQUEADO)
**Objetivo:** Verificar que solo el responsable del proyecto puede agregar workers

**Pasos:**
1. Inicia sesión como **usuario NO responsable** del proyecto (ej: empleado regular)
2. Selecciona un proyecto donde otro usuario es el responsable
3. Intenta agregar un worker
4. **Resultado esperado:** Mensaje de error `⛔ No tienes permiso...`

### Test 2: Agregar Worker del Mismo Departamento (SIN NOTIFICACIÓN)
**Objetivo:** Verificar que no se envía email al agregar workers del mismo departamento

**Pasos:**
1. Inicia sesión como **responsable de proyecto** (ej: Juan - Departamento: Innovación)
2. Selecciona un proyecto
3. Selecciona un worker del mismo departamento (Innovación)
4. Click en "Agregar Seleccionados"
5. **Resultado esperado:**
   - ✅ Mensaje: "1 consultor(es) agregado(s) exitosamente"
   - ✅ "1 del mismo departamento (sin notificación)"
   - 📭 No se envía email

### Test 3: Agregar Worker de Otro Departamento (CON NOTIFICACIÓN)
**Objetivo:** Verificar que se envía email al agregar workers de otro departamento

**Pasos:**
1. Inicia sesión como responsable de proyecto (ej: Juan - Innovación)
2. Selecciona un proyecto
3. Selecciona un worker de diferente departamento (ej: Lupita - Finanzas)
4. Click en "Agregar Seleccionados"
5. **Resultado esperado:**
   - ✅ Mensaje: "1 consultor(es) agregado(s) exitosamente"
   - ✅ "1 de otros departamentos (notificados)"
   - 📧 Email enviado al líder de Finanzas

### Test 4: Agregar Múltiples Workers (MIXTO)
**Objetivo:** Verificar el comportamiento con mezcla de departamentos

**Pasos:**
1. Inicia sesión como responsable (ej: Juan - Innovación)
2. Selecciona un proyecto
3. Selecciona:
   - 2 workers de Innovación
   - 1 worker de Finanzas
   - 1 worker de Recursos Humanos
4. Click en "Agregar Seleccionados"
5. **Resultado esperado:**
   - ✅ "4 consultor(es) agregado(s) exitosamente"
   - ✅ "2 del mismo departamento (sin notificación)"
   - ✅ "2 de otros departamentos (notificados)"
   - 📧 2 emails enviados (a líder de Finanzas y RH)

### Test 5: Líder de Departamento NO Encontrado
**Objetivo:** Verificar comportamiento cuando no existe líder para un departamento

**Pasos:**
1. Crea un departamento sin un líder (sin workers con "jefe"/"líder" en el rol)
2. Intenta asignar un worker de ese departamento a un proyecto
3. **Resultado esperado:**
   - ✅ Worker se agrega al proyecto
   - ⚠️ Log en consola: "Líder no encontrado para este departamento"
   - 📭 No se envía email (pero no hay error)

## Debugging

### Ver Logs en Console
1. Abre DevTools (F12)
2. Ve a la pestaña "Console"
3. Busca logs con:
   - `✅` = Acciones exitosas
   - `⛔` = Errores de autorización
   - `📧` = Emails enviados
   - `❌` = Errores

### Ver Logs en Server
Si eres admin del servidor:
```bash
# Próximo: Logs del endpoint SMTP
tail -f /var/log/api/smtp.log
```

### Verificar Email Enviado
1. **Opción 1:** Revisar el inbox del líder del departamento
2. **Opción 2:** Si usas Gmail, revisar "Todos los correos" o "Bandeja de entrada"
3. **Opción 3:** Usar herramientas como Mailhog en desarrollo

## Troubleshooting

### "SMTP deshabilitado (SMTP_ENABLED=false)"
**Solución:** Configura `SMTP_ENABLED=true` en `.env.local`

### "Error enviando email a..."
**Causas posibles:**
- `MAIL_USER` o `MAIL_APP_PASSWORD` incorrectos
- Email del líder es vacío o inválido
- Servidor SMTP rechaza la conexión

**Verificación:**
```typescript
// En la consola del navegador, verifica que el líder tiene email
console.log(departmentHead); // Debe tener { id, email, name }
```

### "Líder de departamento no encontrado"
**Causa:** El worker's `department_id` no tiene un worker con "jefe"/"líder" en el rol

**Solución:**
1. Actualiza el rol del departamento manager a incluir "Jefe" o "Líder"
2. O asigna manualmente un `department_head_id` (mejora futura)

### Email no recibido pero sin error
**Verificación:**
1. Abre DevTools → Console → busca "Email enviado exitosamente"
2. Verifica que `SMTP_ENABLED=true`
3. Prueba manualmente el endpoint:

```bash
curl -X POST http://localhost:3000/api/smtp/send \
  -F "email=test@example.com" \
  -F "name=Test User" \
  -F "message=Test message" \
  -F "xlsxBase64=<base64-data>"
```

## Datos de Prueba Recomendados

Para testing local, asegúrate de tener en tu base de datos:

### Workers
```
- Juan Pérez (Jefe de Innovación, juan@empresa.com, dept_id=1)
- Carlos López (Consultor, carlos@empresa.com, dept_id=1)
- Lupita García (Contadora, lupita@empresa.com, dept_id=2)
- José García (Jefe de Finanzas, jose@empresa.com, dept_id=2)
```

### Proyectos
```
- Proyecto A (responsable=1, Juan Pérez)
- Proyecto B (responsable=2, José García)
```

## Auditoría Manual

### Ver qué emails se enviaron
```sql
-- (Requiere tabla de logs en BD)
SELECT * FROM email_logs WHERE type='department_notification' ORDER BY created_at DESC;
```

### Ver asignaciones creadas
```sql
SELECT 
  ah.assigned_to,
  ah.assigned_by,
  w.name,
  w.department_id,
  ah.project_id
FROM assigned_hours ah
JOIN workers w ON ah.assigned_to = w.id
WHERE ah.created_at >= NOW() - INTERVAL '1 hour'
ORDER BY ah.created_at DESC;
```

## Limpieza Post-Testing

Para resetear datos de testing:
```bash
# Eliminar asignaciones de prueba
DELETE FROM assigned_hours WHERE created_at >= '2024-01-XX' AND project_id IN (SELECT id FROM projects WHERE name LIKE '%test%');

# O restaurar desde backup
psql -U postgres < backup.sql
```

## Validación de Implementación

Checklist de features implementadas:
- [x] Verificar que solo responsable puede agregar workers
- [x] Separar workers por departamento
- [x] Generar XLSX con datos del worker
- [x] Encontrar líder del departamento
- [x] Enviar email con XLSX para workers de otro departamento
- [x] Mostrar mensaje diferenciado (mismo dept vs otro dept)
- [x] Manejo robusto de errores
- [x] Logging detallado en consola

## Próximas Mejoras

- [ ] Tabla `email_notifications` para auditoría
- [ ] Dashboard de notificaciones para líderes de departamento
- [ ] Reaprobar asignaciones desde email
- [ ] Templates HTML para emails
- [ ] Retry automático si falla el envío
- [ ] Usar `department_head_id` en lugar de buscar por rol

#!/usr/bin/env node

/**
 * Script de prueba para verificar el flujo de creación automática de usuarios
 * Simula el comportamiento del frontend después del login con Clerk
 */

const API_URL = 'https://linktech-ma-server-db.vercel.app/api/permissions';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
};

/**
 * Simula el flujo de login de Clerk
 */
async function simulateClerkLogin(email, name) {
  console.log('\n' + '='.repeat(60));
  log.info(`Simulando login de Clerk para: ${email}`);
  console.log('='.repeat(60) + '\n');

  // Paso 1: Verificar si el usuario existe
  log.step('Paso 1: Verificando si el usuario existe...');
  
  try {
    const getResponse = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`);
    
    if (getResponse.ok) {
      const userData = await getResponse.json();
      log.success('Usuario existente encontrado');
      console.log(JSON.stringify(userData, null, 2));
      return userData;
    } else if (getResponse.status === 404) {
      log.warn('Usuario no encontrado (404)');
      
      // Paso 2: Crear nuevo usuario
      log.step('Paso 2: Creando nuevo usuario...');
      
      const newUser = {
        email,
        name,
        role: 'worker',
        permissions: {
          dashboard: false,
          projects: false,
          consultants: false,
          workers: false,
          client: false,
          billing: false,
          metrics: false,
          cargabilidad: false,
          proyeccion: false,
          disponibilidad: false,
          departamentos: false,
          usuarios: false,
          analisis: false,
          asuetos: false,
          especialidades: false,
          esquemaContratacion: false,
          horasContrato: false,
          horasPorAprobar: false,
          solicitudHoras: false,
          canCreate: false,
          canEdit: false,
          canDelete: false,
          canExport: false,
        },
        isActive: true,
      };

      const postResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (postResponse.ok) {
        const createdData = await postResponse.json();
        log.success('Usuario creado exitosamente con permisos por defecto');
        console.log(JSON.stringify(createdData, null, 2));
        return createdData;
      } else {
        const errorData = await postResponse.json();
        log.error('Error al crear usuario');
        console.error(errorData);
        return null;
      }
    } else {
      log.error(`Error inesperado: ${getResponse.status}`);
      const errorData = await getResponse.json();
      console.error(errorData);
      return null;
    }
  } catch (error) {
    log.error('Error en la petición');
    console.error(error.message);
    return null;
  }
}

/**
 * Actualizar permisos de un usuario
 */
async function updatePermissions(email, permissions) {
  console.log('\n' + '='.repeat(60));
  log.info(`Actualizando permisos para: ${email}`);
  console.log('='.repeat(60) + '\n');

  try {
    const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ permissions }),
    });

    if (response.ok) {
      const data = await response.json();
      log.success('Permisos actualizados exitosamente');
      console.log(JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorData = await response.json();
      log.error('Error al actualizar permisos');
      console.error(errorData);
      return null;
    }
  } catch (error) {
    log.error('Error en la petición');
    console.error(error.message);
    return null;
  }
}

/**
 * Eliminar un usuario (para testing)
 */
async function deleteUser(email) {
  console.log('\n' + '='.repeat(60));
  log.info(`Eliminando usuario: ${email}`);
  console.log('='.repeat(60) + '\n');

  try {
    const response = await fetch(`${API_URL}?email=${encodeURIComponent(email)}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      const data = await response.json();
      log.success('Usuario eliminado exitosamente');
      console.log(JSON.stringify(data, null, 2));
      return data;
    } else {
      const errorData = await response.json();
      log.error('Error al eliminar usuario');
      console.error(errorData);
      return null;
    }
  } catch (error) {
    log.error('Error en la petición');
    console.error(error.message);
    return null;
  }
}

// Ejecutar pruebas
async function runTests() {
  const testEmail = 'test.usuario@linktech.com.mx';
  const testName = 'Usuario de Prueba';

  console.log('\n🧪 INICIANDO PRUEBAS DEL SISTEMA DE PERMISOS\n');

  // Prueba 1: Limpiar usuario de prueba si existe
  log.info('Limpieza: Eliminando usuario de prueba si existe...');
  await deleteUser(testEmail);

  // Prueba 2: Simular primer login (crear usuario)
  await simulateClerkLogin(testEmail, testName);

  // Prueba 3: Simular segundo login (usuario existente)
  await simulateClerkLogin(testEmail, testName);

  // Prueba 4: Actualizar permisos
  await updatePermissions(testEmail, {
    dashboard: true,
    projects: true,
    workers: true,
    canCreate: true,
    canEdit: true,
  });

  // Prueba 5: Verificar permisos actualizados
  await simulateClerkLogin(testEmail, testName);

  // Prueba 6: Limpiar usuario de prueba
  log.info('Limpieza final: Eliminando usuario de prueba...');
  await deleteUser(testEmail);

  console.log('\n✅ PRUEBAS COMPLETADAS\n');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { simulateClerkLogin, updatePermissions, deleteUser };

const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abrahamcastaneda_db_user:YUyG4XXny1TVGtfs@usersmanagelink.e1mihfu.mongodb.net/linktech-management?retryWrites=true&w=majority&appName=UsersManageLink';

const USER_EMAIL = 'abraham.castaneda@linktech.com.mx';

async function grantPermission() {
  let client = null;
  
  try {
    console.log('📌 Conectando a MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('linktech-management');
    const usersCollection = db.collection('userpermissions');
    
    console.log(`🔍 Buscando usuario: ${USER_EMAIL}`);
    
    // Buscar el usuario
    const user = await usersCollection.findOne({ email: USER_EMAIL });
    
    if (!user) {
      console.log(`⚠️ Usuario no encontrado: ${USER_EMAIL}`);
      // Crear el usuario con permisos de lider
      console.log('📝 Creando usuario con rol "lider"...');
      
      const newUser = {
        email: USER_EMAIL,
        name: 'Abraham Castañeda',
        role: 'lider',
        permissions: {
          dashboard: true,
          projects: true,
          consultants: true,
          workers: true,
          client: true,
          billing: true,
          metrics: true,
          cargabilidad: true,
          proyeccion: true,
          disponibilidad: true,
          departamentos: true,
          usuarios: false,
          analisis: true,
          asuetos: true,
          especialidades: true,
          esquemaContratacion: true,
          horasContrato: true,
          horasPorAprobar: true,
          solicitudHoras: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
          canExport: true,
        },
        isActive: true,
        created_at: new Date(),
        updated_at: new Date(),
      };
      
      await usersCollection.insertOne(newUser);
      console.log('✅ Usuario creado con rol "lider"');
      
    } else {
      // Actualizar el usuario existente
      console.log(`✅ Usuario encontrado. Rol actual: "${user.role}"`);
      
      // Actualizar rol a "lider" y habilitar el permiso
      const result = await usersCollection.updateOne(
        { email: USER_EMAIL },
        {
          $set: {
            role: 'lider',
            'permissions.horasPorAprobar': true,
            updated_at: new Date(),
          }
        }
      );
      
      if (result.modifiedCount > 0) {
        console.log('✅ Usuario actualizado:');
        console.log('   - Rol: lider');
        console.log('   - horasPorAprobar: true');
      } else {
        console.log('⚠️ No se realizaron cambios');
      }
    }
    
    console.log('\n✨ ¡Permiso otorgado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar
grantPermission();

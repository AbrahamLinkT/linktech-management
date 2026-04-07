const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://abrahamcastaneda_db_user:YUyG4XXny1TVGtfs@usersmanagelink.e1mihfu.mongodb.net/linktech-management?retryWrites=true&w=majority&appName=UsersManageLink';

async function seedCollections() {
  let client = null;
  
  try {
    console.log('📌 Conectando a MongoDB...');
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    
    const db = client.db('linktech-management');
    
    // Crear colección de hoursrequests
    console.log('📋 Verificando colección: hoursrequests');
    const hoursCollection = db.collection('hoursrequests');
    
    // Crear índices
    await hoursCollection.createIndex({ 'requested_by': 1 });
    await hoursCollection.createIndex({ 'department_head_email': 1 });
    await hoursCollection.createIndex({ 'project_id': 1 });
    await hoursCollection.createIndex({ 'status': 1 });
    await hoursCollection.createIndex({ 'created_at': -1 });
    await hoursCollection.createIndex({ 'consultor_email': 1 });
    
    console.log('✅ Colección hoursrequests lista con índices');
    
    // Crear colección de staffassignmentrequests
    console.log('📋 Verificando colección: staffassignmentrequests');
    const staffCollection = db.collection('staffassignmentrequests');
    
    // Crear índices
    await staffCollection.createIndex({ 'requested_by': 1 });
    await staffCollection.createIndex({ 'department_head_email': 1 });
    await staffCollection.createIndex({ 'consultor_email': 1 });
    await staffCollection.createIndex({ 'project_id': 1 });
    await staffCollection.createIndex({ 'status': 1 });
    await staffCollection.createIndex({ 'created_at': -1 });
    
    console.log('✅ Colección staffassignmentrequests lista con índices');
    
    // Verificar que existan
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);
    
    console.log('\n📊 Colecciones en la BD:');
    console.log(collectionNames.filter(c => c.includes('request') || c.includes('staff')));
    
    console.log('\n✨ ¡Seeding completado exitosamente!');
    
  } catch (error) {
    console.error('❌ Error durante seeding:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.close();
      console.log('🔌 Conexión cerrada');
    }
  }
}

// Ejecutar
seedCollections();

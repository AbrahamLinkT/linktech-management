import { MongoClient, Db } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectDB(): Promise<Db> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('❌ MONGODB_URI no está configurado en variables de entorno');
  }

  // Si ya hay conexión cacheada, retornarla
  if (cachedClient && cachedDb) {
    try {
      // Verificar que la conexión está viva
      await cachedDb.admin().ping();
      return cachedDb;
    } catch (error) {
      console.warn('⚠️ Conexión cacheada no está disponible, reconectando...');
      cachedClient = null;
      cachedDb = null;
    }
  }

  try {
    console.log('📡 Conectando a MongoDB...');
    
    const client = new MongoClient(mongoUri, {
      maxPoolSize: 10,
    });

    await client.connect();
    console.log('✅ Conectado a MongoDB');

    const db = client.db('LinkTech');
    
    // Cachear la conexión
    cachedClient = client;
    cachedDb = db;

    return db;
  } catch (error: any) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    throw error;
  }
}

export async function closeDB(): Promise<void> {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
    console.log('🔌 Conexión a MongoDB cerrada');
  }
}

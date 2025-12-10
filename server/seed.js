const mongoose = require('mongoose');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

const UserPermissions = require('./models/UserPermissions');

const seedUsers = [
  {
    name: 'Abraham Castañeda',
    email: 'abraham.castaneda@linktech.com.mx',
    role: 'admin',
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
      usuarios: true,
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
      canExport: true
    },
    isActive: true
  }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    for (const userData of seedUsers) {
      const user = await UserPermissions.findOneAndUpdate(
        { email: userData.email },
        userData,
        { upsert: true, new: true }
      );

      console.log(`✅ Created/Updated: ${user.name} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active modules: ${Object.keys(user.permissions).filter(key => user.permissions[key]).length}`);
      console.log('');
    }

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

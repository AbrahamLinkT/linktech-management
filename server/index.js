require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const permissionsRoutes = require('./routes/permissions');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'https://linktech-management.vercel.app', 'https://clerk.linktech.com.mx'],
  credentials: true
}));
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Rutas
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

app.use('/api/permissions', permissionsRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: err.message 
  });
});

// Para desarrollo local
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

// Exportar para Vercel
module.exports = app;

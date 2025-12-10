# LinkTech Management - Backend Server

Servidor Express para gestión de permisos por email sin autenticación externa.

## 🚀 Instalación

```bash
cd server
npm install
```

## ⚙️ Configuración

1. Copia el archivo `.env.example` a `.env`:
```bash
cp .env.example .env
```

2. Edita `.env` con tu conexión MongoDB:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/linktech-management
```

## 🗄️ MongoDB Setup

### Opción 1: MongoDB Local
```bash
# Instalar MongoDB (macOS)
brew install mongodb-community

# Iniciar MongoDB
brew services start mongodb-community
```

### Opción 2: MongoDB Atlas (Cloud)
1. Ve a https://www.mongodb.com/cloud/atlas
2. Crea cuenta gratuita → Crea cluster
3. Obtén connection string
4. Úsalo en `MONGODB_URI`

## 🏃 Ejecutar el servidor

### Desarrollo (con auto-reload)
```bash
npm run dev
```

### Producción
```bash
npm start
```

## 📋 API Endpoints

### Permisos

**Obtener permisos de un usuario**
```
GET /api/permissions/:email
```
Respuesta:
```json
{
  "success": true,
  "email": "user@linktech.com.mx",
  "name": "Usuario",
  "role": "admin",
  "permissions": {
    "dashboard": true,
    "projects": true,
    "consultants": true,
    ...
  },
  "isActive": true
}
```

**Crear o actualizar usuario**
```
POST /api/permissions
Content-Type: application/json

{
  "email": "user@linktech.com.mx",
  "name": "Usuario",
  "role": "admin",
  "permissions": {
    "dashboard": true,
    "projects": true
  }
}
```

**Actualizar permisos**
```
PUT /api/permissions/:email
Content-Type: application/json

{
  "role": "manager",
  "permissions": {
    "projects": false
  }
}
```

**Listar todos los usuarios**
```
GET /api/permissions
```

**Eliminar usuario**
```
DELETE /api/permissions/:email
```

## 📁 Estructura

```
server/
├── index.js               # Punto de entrada
├── .env                   # Variables de entorno (no en git)
├── .env.example           # Ejemplo de variables
├── package.json           # Dependencias
├── config/
│   └── database.js        # Conexión MongoDB
├── models/
│   └── UserPermissions.js # Schema de permisos
└── routes/
    └── permissions.js     # API de permisos
```

## 🎭 Roles disponibles

- **admin**: Acceso total
- **manager**: Gestión de proyectos y equipos
- **employee**: Acceso limitado a módulos asignados
- **viewer**: Solo lectura

## 📊 Módulos disponibles

- dashboard, projects, consultants, workers, client
- billing, metrics, cargabilidad, proyeccion
- disponibilidad, departamentos, usuarios, analisis
- asuetos, especialidades, esquemaContratacion
- horasContrato, horasPorAprobar, solicitudHoras

## 🔧 Ejemplo de uso desde el frontend

```javascript
// Obtener permisos del usuario actual
const response = await fetch('http://localhost:3001/api/permissions/user@linktech.com.mx');
const data = await response.json();

if (data.success && data.permissions.projects) {
  // Usuario tiene acceso a proyectos
}
```

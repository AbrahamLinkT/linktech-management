# LinkTech Management Server - Deploy to Vercel

## 📦 Deployment Steps

### 1. Preparar el repositorio

El servidor ya está configurado para Vercel. Asegúrate de que estos archivos estén en tu repo:
- ✅ `vercel.json` - Configuración de Vercel
- ✅ `.gitignore` - Excluye .env y node_modules
- ✅ `package.json` - Dependencias

### 2. Deploy a Vercel

#### Opción A: Desde la terminal (recomendado)

```bash
# Instalar Vercel CLI si no lo tienes
npm install -g vercel

# Desde la carpeta server/
cd server

# Deploy
vercel

# Seguir los prompts:
# - Set up and deploy? Yes
# - Which scope? Tu cuenta
# - Link to existing project? No
# - Project name? linktech-management-server
# - Directory? ./
# - Override settings? No
```

#### Opción B: Desde el dashboard de Vercel

1. Ve a https://vercel.com/new
2. Importa el repositorio `AbrahamLinkT/linktech-management`
3. Configura:
   - **Framework Preset:** Other
   - **Root Directory:** `server`
   - **Build Command:** (dejar vacío)
   - **Output Directory:** (dejar vacío)

### 3. Configurar variables de entorno

En Vercel Dashboard → Settings → Environment Variables:

```
MONGODB_URI = mongodb+srv://abrahamcastaneda_db_user:YUyG4XXny1TVGtfs@usersmanagelink.e1mihfu.mongodb.net/linktech-management?retryWrites=true&w=majority&appName=UsersManageLink

PORT = 80

```

### 4. Redeploy

Después de agregar las variables:
```bash
vercel --prod
```

### 5. Obtener la URL

Después del deploy, Vercel te dará una URL como:
```
https://linktech-management-server.vercel.app
```

### 6. Actualizar el frontend

Actualiza la URL del backend en tu frontend Next.js:

**src/config/api.ts:**
```typescript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://linktech-management-server.vercel.app'
  : 'http://localhost:3001';
```

### 7. Configurar dominio personalizado (Opcional)

En Vercel Dashboard → Domains:
- Agregar: `api.linktech.com.mx`
- Configurar DNS CNAME: `cname.vercel-dns.com`

## 🧪 Verificar el deploy

```bash
# Health check
curl https://linktech-management-server.vercel.app/health

# Obtener permisos
curl https://linktech-management-server.vercel.app/api/permissions/abraham.castaneda@linktech.com.mx
```

## 📝 Notas

- Vercel serverless tiene límite de 10 segundos por request
- MongoDB Atlas debe permitir conexiones desde cualquier IP (0.0.0.0/0)
- Las variables de entorno son diferentes por ambiente (development/production)

## 🔄 Redeploy automático

Cada push a la rama `main` desplegará automáticamente si conectaste el repo con Vercel.

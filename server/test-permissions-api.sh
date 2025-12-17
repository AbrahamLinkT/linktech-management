#!/bin/bash

# Script de prueba para la API de permisos
# Asegúrate de tener curl instalado

API_URL="https://linktech-management-a.vercel.app/api/permissions"
# Para local: API_URL="http://localhost:5000/api/permissions"

echo "🧪 Testing Permissions API"
echo "=========================="
echo ""

# Test 1: Crear nuevo usuario
echo "📝 Test 1: Crear nuevo usuario"
echo "POST /api/permissions"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@linktech.com.mx",
    "name": "Test User",
    "role": "worker"
  }' \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 2: Obtener usuario recién creado
echo "📖 Test 2: Obtener usuario creado"
echo "GET /api/permissions?email=test.user@linktech.com.mx"
curl -X GET "$API_URL?email=test.user@linktech.com.mx" \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 3: Actualizar permisos del usuario
echo "✏️  Test 3: Actualizar permisos"
echo "PUT /api/permissions?email=test.user@linktech.com.mx"
curl -X PUT "$API_URL?email=test.user@linktech.com.mx" \
  -H "Content-Type: application/json" \
  -d '{
    "permissions": {
      "dashboard": true,
      "projects": true,
      "workers": true,
      "canEdit": true
    }
  }' \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 4: Verificar actualización
echo "🔍 Test 4: Verificar permisos actualizados"
echo "GET /api/permissions?email=test.user@linktech.com.mx"
curl -X GET "$API_URL?email=test.user@linktech.com.mx" \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 5: Listar todos los usuarios
echo "📋 Test 5: Listar todos los usuarios"
echo "GET /api/permissions"
curl -X GET "$API_URL" \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 6: Intentar crear usuario duplicado (debe fallar)
echo "❌ Test 6: Intentar crear usuario duplicado"
echo "POST /api/permissions (debe devolver 409)"
curl -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.user@linktech.com.mx",
    "name": "Test User Duplicate",
    "role": "worker"
  }' \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 7: Desactivar usuario
echo "🚫 Test 7: Desactivar usuario"
echo "PUT /api/permissions?email=test.user@linktech.com.mx"
curl -X PUT "$API_URL?email=test.user@linktech.com.mx" \
  -H "Content-Type: application/json" \
  -d '{
    "isActive": false
  }' \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 8: Intentar obtener usuario inactivo
echo "🔒 Test 8: Intentar obtener usuario inactivo"
echo "GET /api/permissions?email=test.user@linktech.com.mx (debe devolver 403)"
curl -X GET "$API_URL?email=test.user@linktech.com.mx" \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 9: Eliminar usuario
echo "🗑️  Test 9: Eliminar usuario de prueba"
echo "DELETE /api/permissions?email=test.user@linktech.com.mx"
curl -X DELETE "$API_URL?email=test.user@linktech.com.mx" \
  -w "\nStatus: %{http_code}\n\n"

sleep 2

# Test 10: Verificar eliminación
echo "✅ Test 10: Verificar eliminación (debe devolver 404)"
echo "GET /api/permissions?email=test.user@linktech.com.mx"
curl -X GET "$API_URL?email=test.user@linktech.com.mx" \
  -w "\nStatus: %{http_code}\n\n"

echo ""
echo "✅ Tests completados!"
echo ""

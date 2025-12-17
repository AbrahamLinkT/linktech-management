const express = require('express');
const router = express.Router();
const UserPermissions = require('../models/UserPermissions');

// Obtener permisos de un usuario por email
router.get('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const userPermissions = await UserPermissions.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!userPermissions) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found',
        permissions: null
      });
    }

    if (!userPermissions.isActive) {
      return res.status(403).json({
        success: false,
        error: 'User account is inactive',
        permissions: null
      });
    }

    res.json({
      success: true,
      email: userPermissions.email,
      name: userPermissions.name,
      role: userPermissions.role,
      permissions: userPermissions.permissions,
      isActive: userPermissions.isActive
    });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error fetching permissions' 
    });
  }
});

// Crear nuevo usuario con permisos por defecto en false
router.post('/', async (req, res) => {
  try {
    const { email, name, role } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    // Verificar si el usuario ya existe
    const existingUser = await UserPermissions.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return res.status(409).json({ 
        success: false,
        error: 'User already exists. Use PUT to update.' 
      });
    }

    // Crear nuevo usuario con todos los permisos en false por defecto
    const defaultPermissions = {
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
      canExport: false
    };

    const newUser = new UserPermissions({
      email: email.toLowerCase(),
      name: name || '',
      role: role || 'worker',
      permissions: defaultPermissions,
      isActive: true
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        permissions: newUser.permissions,
        isActive: newUser.isActive
      }
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error creating user',
      details: error.message
    });
  }
});

// Actualizar permisos de usuario existente
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, role, permissions, isActive } = req.body;

    // Verificar que el usuario existe
    const existingUser = await UserPermissions.findOne({ 
      email: email.toLowerCase() 
    });

    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found. Use POST to create a new user.' 
      });
    }

    const updateData = { updatedAt: Date.now() };
    
    // Actualizar solo los campos proporcionados
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    // Si se proporcionan permisos, actualizar solo los especificados
    if (permissions !== undefined) {
      // Mantener permisos existentes y sobrescribir solo los enviados
      updateData.permissions = {
        ...existingUser.permissions.toObject(),
        ...permissions
      };
    }

    const updatedUser = await UserPermissions.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        permissions: updatedUser.permissions,
        isActive: updatedUser.isActive
      }
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error updating user',
      details: error.message
    });
  }
});

// Listar todos los usuarios y sus permisos
router.get('/', async (req, res) => {
  try {
    const users = await UserPermissions.find({})
      .select('-__v')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error listing users:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error listing users' 
    });
  }
});

// Eliminar usuario
router.delete('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    const result = await UserPermissions.deleteOne({ 
      email: email.toLowerCase() 
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error deleting user' 
    });
  }
});

module.exports = router;

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

// Crear o actualizar permisos de usuario
router.post('/', async (req, res) => {
  try {
    const { email, name, role, permissions } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email is required' 
      });
    }

    const userPermissions = await UserPermissions.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        $set: { 
          name,
          role: role || 'viewer',
          permissions: permissions || {},
          updatedAt: Date.now()
        }
      },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Permissions saved successfully',
      user: {
        email: userPermissions.email,
        name: userPermissions.name,
        role: userPermissions.role,
        permissions: userPermissions.permissions
      }
    });
  } catch (error) {
    console.error('Error saving permissions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error saving permissions' 
    });
  }
});

// Actualizar permisos de usuario existente
router.put('/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { name, role, permissions, isActive } = req.body;

    const updateData = { updatedAt: Date.now() };
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (permissions !== undefined) updateData.permissions = permissions;
    if (isActive !== undefined) updateData.isActive = isActive;

    const userPermissions = await UserPermissions.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: updateData },
      { new: true }
    );

    if (!userPermissions) {
      return res.status(404).json({ 
        success: false,
        error: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'Permissions updated successfully',
      user: {
        email: userPermissions.email,
        name: userPermissions.name,
        role: userPermissions.role,
        permissions: userPermissions.permissions,
        isActive: userPermissions.isActive
      }
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error updating permissions' 
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

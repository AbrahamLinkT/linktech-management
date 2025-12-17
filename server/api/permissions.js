const connectDB = require('../config/database-vercel');
const UserPermissions = require('../models/UserPermissions');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    await connectDB();

    // GET - Obtener permisos por email
    if (req.method === 'GET') {
      const { email } = req.query;

      // Si no hay email, listar todos los usuarios
      if (!email) {
        const users = await UserPermissions.find({})
          .select('-__v')
          .sort({ createdAt: -1 });

        return res.json({
          success: true,
          count: users.length,
          users
        });
      }
      
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

      return res.json({
        success: true,
        email: userPermissions.email,
        name: userPermissions.name,
        role: userPermissions.role,
        permissions: userPermissions.permissions,
        isActive: userPermissions.isActive
      });
    }

    // POST - Crear nuevo usuario
    if (req.method === 'POST') {
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

      return res.status(201).json({
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
    }

    // PUT - Actualizar usuario existente
    if (req.method === 'PUT') {
      const { email } = req.query;
      const { name, role, permissions, isActive } = req.body;

      if (!email) {
        return res.status(400).json({ 
          success: false,
          error: 'Email parameter is required' 
        });
      }

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

      return res.json({
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
    }

    // DELETE - Eliminar usuario
    if (req.method === 'DELETE') {
      const { email } = req.query;

      if (!email) {
        return res.status(400).json({ 
          success: false,
          error: 'Email parameter is required' 
        });
      }
      
      const result = await UserPermissions.deleteOne({ 
        email: email.toLowerCase() 
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ 
          success: false,
          error: 'User not found' 
        });
      }

      return res.json({
        success: true,
        message: 'User deleted successfully'
      });
    }

    // Método no soportado
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });

  } catch (error) {
    console.error('Error in permissions API:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      details: error.message
    });
  }
};

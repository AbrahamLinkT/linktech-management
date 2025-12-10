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

    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ 
        success: false,
        error: 'Email parameter is required' 
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
      error: 'Error fetching permissions',
      details: error.message
    });
  }
};

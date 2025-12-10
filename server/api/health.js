module.exports = async (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'LinkTech Management Server is running',
    timestamp: new Date().toISOString()
  });
};

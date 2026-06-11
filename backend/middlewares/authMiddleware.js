const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentification requise' });
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Ajouter les infos utilisateur à l'objet request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Erreur d\'authentification:', error);
    return res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};
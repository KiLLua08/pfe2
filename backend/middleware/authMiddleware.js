const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

const authMiddleware = async (req, res, next) => {
    try{
        const token = req.header('Authorization').replace('Bearer ', '');

        if (!token) {
            return res.status(401).send({ error: 'Access denied. No token provided.' });
        }
    
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const utilisateur = await Utilisateur.findByPk(decoded.id);
    
            if (!utilisateur) {
                throw new Error();
            }
    
            req.utilisateur = utilisateur;
            next();
        } catch (error) {
            res.status(401).send({ error: 'Invalid token.' });
        }
    
    }
    catch{
        return res.status(401).send({ error: 'Access denied. No token provided.' });
    }
  };

module.exports = authMiddleware;

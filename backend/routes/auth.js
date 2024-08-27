const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');
const authMiddleware = require('../middleware/authMiddleware');
const { OAuth2Client } = require('google-auth-library');

const router = express.Router();


const CLIENT_ID = '959288316382-fbqsnsssonknmtb92phci9lrfagf4bj4.apps.googleusercontent.com'; // Replace with your Google OAuth client ID
const client = new OAuth2Client(CLIENT_ID);




router.post('/login', async (req, res) => {
    const { email, mdp } = req.body;

    // Check if email and password are provided
    if (!email || !mdp) {
        return res.status(400).send('Email and password are required.');
    }

    try {
        const utilisateur = await Utilisateur.findOne({ where: { email } });

        if (!utilisateur) {
            return res.status(404).send('Utilisateur introuvable!');
        }

        const isMatch = await bcrypt.compare(mdp, utilisateur.mdp);
        console.log(isMatch)

        if (!isMatch) {
            return res.status(400).send('Login ou mot de passe invalide!.');
        }

        if (!utilisateur.emailConfirmed) {
            return res.status(400).send('Email en att confirmation');
        }

        if (!utilisateur.etat) {
            return res.status(400).send('Ce compte a été désactivé.' );
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).send('Erreur serveur');
        }

        const token = jwt.sign({ id: utilisateur.id }, process.env.JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, nom: utilisateur.nom, role: utilisateur.role, prenom: utilisateur.prenom,id:utilisateur.id });
    } catch (error) {
        res.status(500).send(error.message);
    }
});




router.post('/google-login', async (req, res) => {
    const { token } = req.body;
  
    try {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload['sub'];
  
      // Handle user authentication and session creation here
      // Example: Generate JWT token and send it to the client
      const jwtToken = generateJWTToken(userid);
  
      res.json({ token: jwtToken });
    } catch (error) {
      console.error('Google token verification failed:', error.message);
      res.status(401).json({ error: 'Unauthorized' });
    }
  });



module.exports = router;

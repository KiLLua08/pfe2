const { Utilisateur } = require('../models');

const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { Op } = require('sequelize');


// Create a new user
exports.createUtilisateur = [
  async (req, res) => {
    try {
      const { nom, prenom, email, mdp, role, etat, expertise } = req.body;
      const img = req.file ? req.file.path : null; // Handle the uploaded file path

      // Check if the email already exists
      const existingUser = await Utilisateur.findOne({ where: { email } });

      if (existingUser) {
        return res.status(400).json({ error: 'Email existe déja.' });
      }



      // Generate confirmation token and expiry
      const token = crypto.randomBytes(20).toString('hex');
      const expires = Date.now() + 3600000; // 1 hour

      // Create new user
      const newUser = await Utilisateur.create({
        nom,
        prenom,
        email,
        mdp, // Assuming mdp is hashed already in the model's hook
        role,
        img,
        etat,
        emailConfirmationToken: token,
        emailConfirmationExpires: expires,
        expertise
      });

      // Send confirmation email
      await sendConfirmationEmail(newUser, token);

      res.status(201).json({ message: 'Utilisateur created. Please check your email for confirmation.' });

    } catch (error) {
      console.error('Failed to create user:', error.message);
      res.status(500).json({ error: error.message });
    }
  },
]
// Get all users
exports.getAllUtilisateurs = async (req, res) => {
  try {
    const users = await Utilisateur.findAll({ attributes: ['id', 'nom', 'prenom', 'email', 'img', 'role', 'etat'], order: [['id', 'DESC']] });
    res.status(200).json(users);
  } catch (error) {
    console.error('Failed to fetch users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

// Get a single user by ID
exports.getUtilisateurById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Utilisateur.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to fetch user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};
// Get a single user by Role
exports.getUtilisateursByRole = async (req, res) => {
  const { role } = req.params; // Assuming role is passed as a URL parameter

  try {
    // Fetch utilisateurs with specific role and etat === 1
    const utilisateurs = await Utilisateur.findAll({
      attributes: ['id', 'nom', 'prenom'],
      where: {
        role,
        etat: 1,
      },
    });

    // Respond with the list of utilisateurs
    res.json(utilisateurs);
  } catch (error) {
    console.error('Error fetching utilisateurs by role:', error.message);
    res.status(500).json({ error: 'An error occurred while fetching utilisateurs.' });
  }
};

// Update a user by ID
exports.updateUtilisateur = async (req, res) => {
  const { id } = req.params;
  const { nom, prenom, img, email, mdp, role, etat, expertise } = req.body;



  try {
    const user = await Utilisateur.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields
    user.nom = nom !== undefined ? nom : user.nom;
    user.prenom = prenom !== undefined ? prenom : user.prenom;
    user.img = img !== undefined ? img : user.img;
    user.email = email !== undefined ? email : user.email;
    user.role = role !== undefined ? role : user.role;
    user.etat = etat !== undefined ? etat : user.etat;
    user.expertise = expertise !== undefined ? expertise : user.expertise;

    // Hash password if it is being updated
    if (mdp) {
      const salt = await bcrypt.genSalt(10);
      user.mdp = await bcrypt.hash(mdp, salt);
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Failed to update user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

// Delete a user by ID
exports.deleteUtilisateur = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await Utilisateur.findByPk(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.destroy();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Failed to delete user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};


exports.confirmEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const utilisateur = await Utilisateur.findOne({
      where: {
        emailConfirmationToken: token,
        emailConfirmationExpires: {
          [Op.gt]: Date.now(),
        },
      },
    });

    if (!utilisateur) {
      return res.status(400).send('Email confirmation token is invalid or has expired.');
    }

    utilisateur.emailConfirmed = true;
    utilisateur.emailConfirmationToken = null;
    utilisateur.emailConfirmationExpires = null;
    await utilisateur.save();

    res.send('Email confirmed successfully.');
  } catch (error) {
    res.status(500).send(error.message);
  }
};




const sendConfirmationEmail = async (user, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',  // Replace with your SMTP host
    port: 587,                  // Replace with your SMTP port (587 for TLS, 465 for SSL)
    secure: false,              // Set to true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },

  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: 'Confirmation Email',
    html: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation d'Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
            max-width: 600px;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bonjour ${user.nom},</h1>
        <p>Merci de vous être inscrit sur notre site. Avant de pouvoir vous connecter, veuillez confirmer votre adresse e-mail en cliquant sur le lien ci-dessous :</p>
        <p><a href="${process.env.BASE_URL}/#/confirm/${token}">Confirmer mon e-mail</a></p>
        <p>Si vous n'avez pas demandé cette inscription, veuillez ignorer cet e-mail.</p>
        <div class="footer">
            <p>Merci et à bientôt !</p>
            <p>L'équipe de Webcraft</p>
        </div>
    </div>
</body>
</html>
`,
  };

  await transporter.sendMail(mailOptions);
};



exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await Utilisateur.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'Email non trouvé.' });
    }

    const token = crypto.randomBytes(20).toString('hex');
    const expires = Date.now() + 3600000; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Réinitialisation du mot de passe',
      html: `
      <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Réinitialisation du Mot de Passe</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            margin: 0 auto;
            max-width: 600px;
            padding: 20px;
            text-align: center;
        }
        h1 {
            color: #333333;
            font-size: 24px;
            margin-bottom: 20px;
        }
        p {
            color: #555555;
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        a {
            color: #007bff;
            text-decoration: none;
            font-weight: bold;
        }
        .footer {
            font-size: 14px;
            color: #888888;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Bonjour ${user.nom},</h1>
        <p>Vous avez demandé une réinitialisation de votre mot de passe. Veuillez cliquer sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
        <p><a href="${process.env.BASE_URL}/#/reset/${token}">Réinitialiser le mot de passe</a></p>
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        <p>Cordialement,</p>
        <p>L'équipe de support</p>
        <div class="footer">
            <p>Merci et à bientôt !</p>
            <p>L'équipe de Webcraft</p>
        </div>
    </div>
</body>
</html>
 `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Email de réinitialisation envoyé.' });
  } catch (error) {
    console.error('Erreur de demande de réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur de demande de réinitialisation du mot de passe.' });
  }
};


exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await Utilisateur.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: { [Op.gt]: Date.now() },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Token invalide ou expiré.' });
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    user.mdp = hashedPassword; // Ensure you hash the password in your model hook
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (error) {
    console.error('Erreur de réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur de réinitialisation du mot de passe.' });
  }
};



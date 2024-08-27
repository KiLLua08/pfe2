const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/UtilisateurController');
const upload = require("../config/multer");
const authMiddleware = require("../middleware/authMiddleware");
// Create a new user
router.post('/', upload.single('img'), utilisateurController.createUtilisateur);

// Get all users
router.get('/', authMiddleware, utilisateurController.getAllUtilisateurs);

// Get a single user by ID
router.get('/:id', authMiddleware, utilisateurController.getUtilisateurById);

router.get('/role/:role', utilisateurController.getUtilisateursByRole);

// Update a user by ID
router.put('/:id', authMiddleware, upload.single('img'), utilisateurController.updateUtilisateur);

// Delete a user by ID
router.delete('/:id', authMiddleware, utilisateurController.deleteUtilisateur);

//email confirmation
router.get('/confirm/:token', utilisateurController.confirmEmail);

router.post('/request-password-reset', utilisateurController.requestPasswordReset);
router.post('/reset-password/:token', utilisateurController.resetPassword);

module.exports = router;

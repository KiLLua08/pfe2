const express = require('express');
const router = express.Router();
const packageController = require('../controllers/PackageController');
const authMiddleware = require("../middleware/authMiddleware");
// Create a new package
router.post('/', authMiddleware, packageController.createPackage);

// Get all packages
router.get('/', packageController.getAllPackages);

// Get a package by ID
router.get('/:id', packageController.getPackageById);

// Update a package by ID
router.put('/:id', authMiddleware, packageController.updatePackage);

// Delete a package by ID
router.delete('/:id', authMiddleware, packageController.deletePackage);

module.exports = router;

const Package = require('../models/Package');
const { Sequelize, DataTypes } = require('sequelize');

// Create a new package
exports.createPackage = async (req, res) => {
    try {
        const { name, description, features, price, ordre_affichage } = req.body;
        const newPackage = await Package.create({ name, description, features, price });
        res.status(201).json(newPackage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all packages
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.findAll({
            order: [
                Sequelize.literal('ordre_affichage IS NULL, ordre_affichage ASC')
            ]
        });
        res.json(packages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a package by ID
exports.getPackageById = async (req, res) => {
    try {
        const package = await Package.findByPk(req.params.id);
        if (package) {
            res.json(package);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a package by ID
exports.updatePackage = async (req, res) => {
    try {
        const { name, description, features, price, ordre_affichage } = req.body;
        const package = await Package.findByPk(req.params.id);
        if (package) {
            await package.update({ name, description, features, price, ordre_affichage });
            res.json(package);
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a package by ID
exports.deletePackage = async (req, res) => {
    try {
        const package = await Package.findByPk(req.params.id);
        if (package) {
            await package.destroy();
            res.json({ message: 'Package deleted successfully' });
        } else {
            res.status(404).json({ message: 'Package not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

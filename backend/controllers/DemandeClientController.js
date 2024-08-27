// controllers/demandeClientController.js

const { Utilisateur } = require('../models');
const DemandeClient = require('../models/DemandeClient');

exports.creerDemandeClient = async (req, res) => {
    try {
        const {
            packageId,
            sujetSite,
            objectifsPrincipaux,
            typesPages,
            logoIdentiteVisuelle,
            referencesSites,
            delaisRealisation,
            fonctionnalitesSpecifiques,
            nomDomaineHebergement,
            styleVisuel,
            concurrents,
            etat,
            clientId
        } = req.body;

        const nouvelleDemandeClient = await DemandeClient.create({
            packageId,
            sujetSite,
            objectifsPrincipaux,
            typesPages,
            logoIdentiteVisuelle,
            referencesSites,
            delaisRealisation,
            fonctionnalitesSpecifiques,
            nomDomaineHebergement,
            styleVisuel,
            concurrents,
            etat,
            clientId
        });

        res.status(201).json(nouvelleDemandeClient);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// controllers/demandeClientController.js

// Fetch all DemandeClients
exports.getAllDemandeClients = async (req, res) => {
    try {
        const demandeClients = await DemandeClient.findAll({
            include: [{
                model: Utilisateur,
                attributes: ['id', 'nom', 'prenom'],
                as: 'clientDemande' // Fetch only the desired fields
            }]
        });
        res.status(200).json(demandeClients);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Fetch a DemandeClient by ID
exports.getDemandeClientById = async (req, res) => {
    const { id } = req.params;
    try {
        const demandeClient = await DemandeClient.findByPk(id, {
            include: [{
                model: Utilisateur,
                attributes: ['id', 'nom', 'prenom'],
                as: 'clientDemande'  // Fetch only the desired fields
            }]
        });;
        if (demandeClient) {
            res.status(200).json(demandeClient);
        } else {
            res.status(404).json({ message: 'DemandeClient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/demandeClientController.js

exports.updateDemandeClient = async (req, res) => {
    const { id } = req.params;
    const {
        packageId,
        sujetSite,
        objectifsPrincipaux,
        typesPages,
        logoIdentiteVisuelle,
        referencesSites,
        delaisRealisation,
        fonctionnalitesSpecifiques,
        nomDomaineHebergement,
        styleVisuel,
        concurrents,
        etat
    } = req.body;

    try {
        const demandeClient = await DemandeClient.findByPk(id);
        if (demandeClient) {
            await demandeClient.update({
                packageId,
                sujetSite,
                objectifsPrincipaux,
                typesPages,
                logoIdentiteVisuelle,
                referencesSites,
                delaisRealisation,
                fonctionnalitesSpecifiques,
                nomDomaineHebergement,
                styleVisuel,
                concurrents,
                etat
            });
            res.status(200).json(demandeClient);
        } else {
            res.status(404).json({ message: 'DemandeClient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// controllers/demandeClientController.js

exports.deleteDemandeClient = async (req, res) => {
    const { id } = req.params;
    try {
        const demandeClient = await DemandeClient.findByPk(id);
        if (demandeClient) {
            await demandeClient.destroy();
            res.status(204).send(); // No content
        } else {
            res.status(404).json({ message: 'DemandeClient not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};




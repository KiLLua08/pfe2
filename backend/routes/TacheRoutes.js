const express = require("express");
const router = express.Router();
const TacheController = require("../controllers/TacheController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// Routes for Taches
router.get("/", authMiddleware, TacheController.getAllTaches);
router.get("/:id", authMiddleware, TacheController.getTacheById);
router.post("/", authMiddleware, upload.array('attachments'), TacheController.createTache);
router.put("/:id", authMiddleware, TacheController.updateTache);
router.delete("/:id", authMiddleware, TacheController.deleteTache);

// Routes for Tache Attachments
router.post('/:tacheId/attachments', authMiddleware, upload.array('attachments'), TacheController.addAttachment);
router.delete('/attachments/:attachmentId', authMiddleware, TacheController.deleteAttachment);

// Routes for Tache Logs
router.post("/:tacheId/logs", authMiddleware, TacheController.addLog);
router.get("/:tacheId/logs", authMiddleware, TacheController.getLogsByTacheId);
router.put("/log/:logId", authMiddleware, TacheController.updateLog);
router.delete("/log/:logId", authMiddleware, TacheController.deleteLog);

module.exports = router;

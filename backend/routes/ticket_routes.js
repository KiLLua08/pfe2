const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/TicketController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../config/multer");

// Routes for Tickets

// Routes for Tickets
router.get("/", authMiddleware, TicketController.getAllTickets);
router.get("/clients",  TicketController.getClientsFromTickets);
router.get("/assigned",  TicketController.getAssignedUsersFromTickets);
router.post("/by-client", authMiddleware, TicketController.getAllTicketsbyClient);

router.get("/:id", authMiddleware, TicketController.getTicketById);
router.post(
  "/",
  authMiddleware,
  upload.array('attachments'),
  TicketController.createTicket
);
router.put("/:id", authMiddleware, TicketController.updateTicket);
router.delete("/:id", authMiddleware, TicketController.deleteTicket);

// Routes for Ticket Attachments
router.post('/:ticketId/attachments',
  authMiddleware,
  upload.array('attachments'), // Handle file uploads
  TicketController.addAttachment // Controller to handle adding attachments
);
router.delete(
  "/attachments/:attachmentId",
  authMiddleware,
  TicketController.deleteAttachment
);

// Routes for Ticket Subscribers
router.post("/:ticketId/subscribers", authMiddleware, TicketController.addSubscriber);
router.delete(
  "/:ticketId/subscribers/:userId",
  authMiddleware,
  TicketController.removeSubscriber
);

// Create a log for a ticket
router.post("/:ticketId/logs", authMiddleware, TicketController.addLog);

// Get logs for a ticket
router.get("/:ticketId/logs", authMiddleware, TicketController.getLogsByTicketId);

// Update a log
router.put("/log/:logId", authMiddleware, TicketController.updateLog);

// Delete a log
router.delete("/log/:logId", authMiddleware, TicketController.deleteLog);

module.exports = router;

const express = require('express');
const router = express.Router();
const ChatController = require('../controllers/ChatController');
const authMiddleware = require("../middleware/authMiddleware");

// Create a new chat
router.post('/',  authMiddleware,ChatController.createChat);

// Add a user to a chat
router.post('/:chatId/users',authMiddleware, ChatController.addUserToChat);

// Send a message in a chat
router.post('/:chatId/messages',authMiddleware, ChatController.sendMessage);

// Get all messages in a chat
router.get('/:chatId/messages',authMiddleware, ChatController.getMessages);

// Get a specific message by ID
router.get('/:chatId/messages/:messageId',authMiddleware, ChatController.getMessageById);

// Route to get a chat by ID
router.get('/chats/:chatId', ChatController.getOneChatById);

// Route to get chats by creator ID
router.get('/creator/:creatorId',authMiddleware, ChatController.getChatsByCreatorId);


router.get('/', ChatController.getAllChatsWithLastMessage);



module.exports = router;
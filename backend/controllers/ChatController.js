const { Chat, ChatUser, Utilisateur } = require('../models');

const Message  = require('../models/Message');


exports.createChat = async (req, res) => {
    const { subject, creatorId, projectId } = req.body;

    try {
        const chat = await Chat.create({ subject, creatorId, projectId });
        await ChatUser.create({ chatId: chat.id, userId: creatorId, isAdmin: true });

        res.status(201).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create chat' });
    }
};

exports.addUserToChat = async (req, res) => {
    const { chatId, userId, isAdmin } = req.body;

    try {
        const chatUser = await ChatUser.create({ chatId, userId, isAdmin });
        res.status(201).json(chatUser);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add user to chat' });
    }
};

// Send a message in a chat
// exports.sendMessage = async (req, res) => {
//     const { chatId, senderId, content, attachment, seen } = req.body;

//     try {
//         const message = await Message.create({ chatId, senderId, content, attachment, seen });
//         res.status(201).json(message);
//     } catch (error) {
//         console.error('Error creating message:', error); // Log the error for debugging
//         res.status(500).json({ error: error.message || 'Failed to send message' });
//     }
// };
exports.sendMessage = async (req, res) => {
    const { chatId, senderId, content, attachment, seen } = req.body;
  
    try {

      const message = await Message.create({ chatId, senderId, content, attachment, seen });
  
      const fullMessage = await Message.findOne({
        where: { id: message.id },
        include: {
          model: Utilisateur,
          attributes: ['id', 'nom', 'prenom', 'img']
        }
      });
  
      req.app.get('io').to(chatId).emit('recieve_message', fullMessage);
  
      res.status(201).json(fullMessage);
    } catch (error) {
      console.error('Error creating message:', error);
      res.status(500).json({ error: error.message || 'Failed to send message' });
    }
  };
  
  

exports.getMessages = async (req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await Message.findAll({ where: { chatId },  include: [
            {
                model: Utilisateur,
                attributes: ['id', 'nom', 'prenom', 'img'] // Attributes for the Utilisateur model
            }
        ], });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
};

exports.getMessageById = async (req, res) => {
    const { chatId, messageId } = req.params;

    try {
        const message = await Message.findOne({ where: { id: messageId, chatId } });
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json(message);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve message' });
    }
};

exports.getAllChats = async (req, res) => {
    try {
        const chats = await Chat.findAll();
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
};

exports.getChatsByCreatorId = async (req, res) => {
    const { creatorId } = req.params; 

    try {
        const chats = await Chat.findAll({ where: { creatorId } }); 
        if (chats.length === 0) {
            return res.status(404).json({ error: 'No chats found for this creator' });
        }
        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chats' });
    }
};

exports.getAllChatsWithLastMessage = async (req, res) => {
    try {
        const chats = await Chat.findAll({
            attributes: ['id', 'subject', 'creatorId', 'projectId'],
            include: [
                {
                    model: Message,
                    attributes: ['id', 'content','senderId', 'createdAt'],
                    include: [
                        {
                            model: Utilisateur,
                            attributes: ['id', 'nom', 'prenom', 'img']
                        }
                    ],
                    order: [['createdAt', 'DESC']],
                    limit: 1
                }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(chats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

};

exports.getOneChatById = async (req, res) => {
    const { chatId } = req.params;

    try {
        const chat = await Chat.findOne({
            where: { id: chatId },
            include: [
                {
                    model: Message,
                    attributes: ['id', 'content', 'senderId', 'createdAt'],
                    include: [
                        {
                            model: Utilisateur,
                            attributes: ['id', 'nom', 'prenom', 'img']
                        }
                    ],
                    order: [['createdAt', 'ASC']]
                }
            ]
        });

        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }

        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve chat' });
    }
};

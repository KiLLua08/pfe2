const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const dotenv = require('dotenv');
const sequelize = require('./config/database');
const ticketRoutes = require('./routes/ticket_routes');
const chatRoutes = require('./routes/chatRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/auth');
const demandeClientRoutes = require('./routes/DemandeClientRoutes');
const ProjetRoutes = require('./routes/ProjetRoutes');
const UserStoriesRoutes = require('./routes/userstoriesRoutes');
const SprintRoutes = require('./routes/sprintRoutes');
const TacheRoutes = require('./routes/TacheRoutes');
const packageRoutes = require('./routes/packageRoutes');

dotenv.config();
const app = express();
const port =5000;

// Middleware
app.use(morgan(':method :url :status :response-time ms'));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
});

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/package', packageRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/ticket', ticketRoutes);
app.use('/api/utilisateur', utilisateurRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/demande-client', demandeClientRoutes);
app.use('/api/projet', ProjetRoutes);
app.use('/api/userstories', UserStoriesRoutes);
app.use('/api/sprint', SprintRoutes);
app.use('/api/tache', TacheRoutes);

// Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

// Socket.IO
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('createdChat', (chat) => {
    console.log('Chat created:', chat);
  });

  socket.on("sendChat", (chat) => {
    io.to(chat.id).emit("recieveChat", chat);
    console.log('Sending chat:', chat);
  });

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
    console.log(`User ${socket.id} joined chat: ${chatId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start Server
server.listen(port, async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync({ force: false });
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
  console.log(`App listening at http://localhost:${port}`);
});
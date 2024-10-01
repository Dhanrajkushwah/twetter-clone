const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes'); 
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const socketIO = require('socket.io');

// Import the Message model
const Message = require('./models/Message.model'); // Ensure this path is correct

// Create Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON requests
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// Create an HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*', // Allow CORS for all origins (or specify the frontend URL)
        methods: ['GET', 'POST']
    }
});

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://Contas:nuouP4MyDhH0q3E4@cluster0.gkkofhc.mongodb.net/twitter'; // Change as needed
mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Use user routes
app.use(cors());
app.use(express.json());
app.use('/api', userRoutes);

// Socket.IO connection handling
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
  
    // Handle the 'sendMessage' event
    socket.on('sendMessage', async (data) => {
      const { content, senderId, recipientId } = data;
  
      try {
        // Create the message object and save to the database
        const message = new Message({ content, sender: senderId, recipient: recipientId });
        await message.save();
  
        // Emit the message to all clients
        io.emit('receiveMessage', message); // Change to emit to specific rooms/users if needed
  
      } catch (error) {
        console.error('Error saving message:', error);
      }
    });  

     // Send notifications when a tweet is posted
  socket.on('sendNotification', (notification) => {
    io.emit('receiveNotification', notification);
  });
    // Handle user disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Start the server with Socket.IO and Express on the same port
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

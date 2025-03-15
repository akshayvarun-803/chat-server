const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

const users = {}; // Track users per socket ID
const rooms = {}; // Track rooms and users in them

// Serve static frontend files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Default route
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Socket.IO logic
io.on('connection', socket => {
  socket.on('join-room', ({ room, name }) => {
    socket.join(room); // Join user to the specific room
    users[socket.id] = name;

    // Notify others in the room
    socket.to(room).emit('user-connected', name);

    // Listen for chat messages
    socket.on('send-chat-message', message => {
      io.to(room).emit('chat-message', {
        message,
        name: users[socket.id]
      });
    });

    // Handle user disconnect
    socket.on('disconnect', () => {
      socket.to(room).emit('user-disconnected', users[socket.id]);
      delete users[socket.id];
    });
  });
});

// Run server
http.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});

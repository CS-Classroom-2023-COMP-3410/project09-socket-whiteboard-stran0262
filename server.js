const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('draw', (drawingData) => {
    io.emit('draw', drawingData);  // Send to ALL clients, including sender
  });

  // Handle canvas clearing
  socket.on('clear', () => {
    io.emit('clear'); // Send clear event to all clients
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

server.listen(5173, () => {
  console.log('Server running on http://localhost:5173');
});

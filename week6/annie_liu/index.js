const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

let users = {};

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  
  socket.emit('nickname prompt');

  socket.on('set nickname', (nickname) => {
    users[socket.id] = nickname || 'Anonymous';
    console.log(`${nickname} has joined the chat.`);
    io.emit('nickname confirmation', `${nickname} has joined the chat.`);
  });

  socket.on('chat message', (msg) => {
    const nickname = users[socket.id] || 'Anonymous';
    const timestamp = new Date().toLocaleTimeString();
    io.emit('chat message', { nickname, msg, timestamp });
  });

  socket.on('disconnect', () => {
    const nickname = users[socket.id];
    if (nickname) {
      io.emit('user message', `${nickname} has left the chat.`);
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

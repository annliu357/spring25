const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let users = {};

mongoose.connect("mongodb://annieliu0189:T19PG36vZpSmG2XY@cluster0-shard-00-00.ywya4.mongodb.net:27017,cluster0-shard-00-01.ywya4.mongodb.net:27017,cluster0-shard-00-02.ywya4.mongodb.net:27017/?replicaSet=atlas-rcb5vr-shard-0&ssl=true&authSource=admin&retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

const messageSchema = new mongoose.Schema({
  nickname: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: String, required: true }
});

const Message = mongoose.model("Message", messageSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', async (socket) => {
  console.log('A user connected');

  try {
   
    const messages = await Message.find().sort({ _id: 1 }).limit(50);
    socket.emit('previous messages', messages);
  } catch (err) {
    console.error("Error fetching messages:", err);
  }

  socket.emit('nickname prompt');

  socket.on('set nickname', (nickname) => {
    users[socket.id] = nickname || 'Anonymous';
    console.log(`${nickname} joined`);
    io.emit('user message', `${nickname} joined`);
  });

  socket.on('chat message', async (msg) => {
    const nickname = users[socket.id] || 'Anonymous';
    const timestamp = new Date().toLocaleTimeString();

    io.emit('chat message', { nickname, msg, timestamp });

    try {
      const message = new Message({ nickname, content: msg, timestamp });
      await message.save();
      console.log(`Message saved: ${nickname}: ${msg} [${timestamp}]`);
    } catch (err) {
      console.error("Error saving message:", err);
    }
  });

  socket.on('disconnect', () => {
    const nickname = users[socket.id];
    if (nickname) {
      console.log(`${nickname} left`);
      io.emit('user message', `${nickname} left`);
      delete users[socket.id];
    }
  });
});

server.listen(3000, () => {
  console.log("Server listening on port 3000");
});

const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const port = 8006;

const app = express();
const server = createServer(app);
const io = new Server(server);

var incValue = 0;

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('Increment', () => {
      incValue++;
      io.emit('incValChange', incValue);
    });
});

server.listen(port, () => {
  console.log('server running at http://localhost:'+port);
});
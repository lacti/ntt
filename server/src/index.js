import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cors from 'cors';

import http from 'http';
import socketio from 'socket.io';

import randomName from 'node-random-name';

const app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  return res.json('something special');
});

const server = http.Server(app);
const io = socketio(server);
const users = [];
const newUser = () => ({
  name: randomName(),
  x: Math.floor(Math.random() * 30),
  y: Math.floor(Math.random() * 30),
});
let clients = [];
io.on('disconnect', socket => {
  clients = clients.filter(each => each !== socket);
});
const broadcast = () =>
  clients.forEach(socket => socket.emit('users', JSON.stringify(users)));
io.on('connection', socket => {
  clients.push(socket);
  users.unshift(newUser());
  broadcast();

  socket.on('chat', msg => {
    console.log(msg);
    socket.emit('chat', 'hi all');
  });
  socket.on('move', msg => {
    console.log(msg);
    const clientUser = JSON.parse(msg);
    const user = users.find(each => each.name === clientUser.name);
    if (user) {
      user.x = clientUser.x;
      user.y = clientUser.y;
      broadcast();
    }
  });
});

server.listen(3001, () => {
  console.log('listen on 3001');
});

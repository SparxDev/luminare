const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const server = http.createServer(app);
const io = require('socket.io')(server);
const { PeerServer } = require('peer');
const { v4: uuidv4 } = require('uuid');
server.listen(8080/* , 'localhost' */);

const peerServer = PeerServer({ port: 8081, path: '/myapp' });

app.use('/assets', express.static(__dirname + '/public/assets'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', __dirname + '/public/view');
app.set('view engine', 'pug');

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/r/:room', (req, res) => {
  res.render('room', { roomName: req.params.room });
});

io.on('connection', socket => {
  socket.on('init', (roomName, uuid) => {
    socket.join(roomName);
    socket.to(roomName).broadcast.emit('usrconnected', uuid);

    socket.on('disconnect', () => {
      socket.to(roomName).broadcast.emit('usrdisconnected', uuid);
    });
  });
});
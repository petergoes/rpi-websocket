const express = require('express');
const app = express();

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);

server.listen('3000');
app.use(express.static('public'));

io.on('connection', (socket) => {
	console.log('on connection');
});

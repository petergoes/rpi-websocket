'use strict';

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const totalLeds = 64;
const leds = [];
const assignedLeds = {};

server.listen('3000');
app.use(express.static('public'));

for (let i = 0; i < totalLeds; i++) {
	leds.push(i);
}

io.on('connection', (socket) => {
	socket.on('led-request', (clientId) => {
		const totalLeds = leds.length;
		const ledIndex = Math.floor(Math.random() * totalLeds);
		const ledId = leds.splice(ledIndex, 1)[0];

		assignedLeds[ledId] = {
			clientId,
			ledId,
			active: false
		};

		socket.emit('led-assignment', assignedLeds[ledId]);
	});

	socket.on('toggle-led', (id) => {
		assignedLeds[id].active = !assignedLeds[id].active;
		socket.emit('led-status', assignedLeds[id]);
	});
});

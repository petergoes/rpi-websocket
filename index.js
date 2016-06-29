const LedControl = require("rpi-led-control");
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const totalLeds = 64;
const leds = [];
const assignedLeds = {};
const lc = new LedControl(11, 10, 9);

server.listen('3000');
app.use(express.static('public'));

for (var i = 1; i < totalLeds + 1; i++) {
	leds.push(i);
}

lc.setBrightness(0, 15);

io.on('connection', function(socket) {
	socket.on('led-request', function(clientId) {
		const totalLeds = leds.length;
		const ledIndex = Math.floor(Math.random() * totalLeds);
		const ledId = leds.splice(ledIndex, 1)[0];

		assignedLeds[ledId] = {
			clientId: clientId,
			ledId: ledId,
			active: false
		};

		socket.emit('led-assignment', assignedLeds[ledId]);
	});

	socket.on('toggle-led', function(id) {
		assignedLeds[id].active = !assignedLeds[id].active;
		socket.emit('led-status', assignedLeds[id]);
		setLeds();
	});
});

function setLeds() {
	lc.setLed(0, 1, 1, 1);
	for (var i = 0; i < totalLeds; i++) {
		var x = i % 8;
		var y = Math.floor( i / 8 );
		if (assignedLeds[i+1] && assignedLeds[i+1].active) {
			lc.setLed(0, x, y, 1);
		} else {
			lc.setLed(0, x, y, 0);
		}
	}
}

process.on('SIGINT', function() {
	for (var i = 0; i < totalLeds; i++) {
		var x = i % 8;
		var y = Math.floor( i / 8 );
		lc.setLed(0, x, y, 0);
	}

	process.exit(0);
});

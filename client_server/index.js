// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

io.on('connection', function (socket) {
  console.log('socket connected');
  socket.emit('text', 'wow. such event. very real time.');
  socket.on('move', function (data) {
    socket.emit('move', data);
  });
});




// var server = require('http').createServer();
// var io = require('socket.io')(server);

// io.sockets.on('connection', function (socket) {
//     console.log('socket connected');

//     socket.on('disconnect', function () {
//         console.log('socket disconnected');
//     });

//     socket.emit('text', 'wow. such event. very real time.');
// });

// server.listen(3000);
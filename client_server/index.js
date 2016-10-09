// Setup basic express server
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 8000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

var socket_dict = {};

io.on('connection', function (socket) {
  socket_dict[socket.id] = socket;
  console.log('socket connected >>>', socket.id);
  // console.log(socket);

  socket.emit('text', 'wow. such event. very real time.');
  socket.on('text_move', function (data) {
    console.log('text_move', data);

    for (var key in socket_dict) {
      if (socket_dict[key].connected) {
        console.log(key);
        socket_dict[key].emit('move', data);
      };
    }
  });

  socket.on('move', function (data) {
    socket.emit('move', data);
  });
});

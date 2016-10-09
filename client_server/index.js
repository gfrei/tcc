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

  socket.emit('doge', 'wow. such event. very real time.');



  // Cordova
  socket.on('order_move', function (data) {
    console.log('order_move', data);

    for (var key in socket_dict) {
      if (socket_dict[key].connected) {
        // console.log(key);
        socket_dict[key].emit('move', data);
      }
    }
  });

  socket.on('order_reset', function () {
    console.log('order_reset');

    for (var key in socket_dict) {
      if (socket_dict[key].connected) {
        socket_dict[key].emit('reset');
      }
    }
  });

  socket.on('order_print', function (data) {
    console.log(data);
  })




  socket.on('move', function (data) {
    socket.emit('move', data);
  });
  socket.on('reset', function () {
    socket.emit('reset');
  });
});

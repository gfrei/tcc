$(function() {

  var $currentInput = $usernameInput.focus();

  var socket = io();

  // Sends a chat message
  function sendMessage () {
    var message = "asdsad";
      socket.emit('new message', message);
    }
  }

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('move', function (data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });
});


function onDocumentKeyDown () {
    switch( event.keyCode ) {
        case 83: /*s*/ socket.emit('echo_move', {'x': 0.01,'y':0,'z':0}); break;
        case 87: /*w*/ socket.emit('echo_move', {'x':-0.01,'y':0,'z':0}); break;
        case 68: /*d*/ socket.emit('echo_move', {'x':0,'y': 0.01,'z':0}); break;
        case 65: /*a*/ socket.emit('echo_move', {'x':0,'y':-0.01,'z':0}); break;
        case 81: /*q*/ socket.emit('echo_move', {'x':0,'y':0,'z': 0.01}); break;
        case 69: /*e*/ socket.emit('echo_move', {'x':0,'y':0,'z':-0.01}); break;
    }
}

document.addEventListener( 'keydown', onDocumentKeyDown, false );


function onDocumentKeyDown () {
    switch( event.keyCode ) {
    
        case 81: /*q*/
        	g_octaves++;
        	rotate({'x':0,'y':0,'z': 0.01});
        	break;
        case 65: /*a*/
        	g_octaves--;
        	rotate({'x':0,'y':-0.01,'z':0});
        	break;
        case 87: /*w*/
        	g_period += 10;
        	rotate({'x':-0.01,'y':0,'z':0});
        	break;
        case 83: /*s*/
        	g_period -= 10;
        	rotate({'x': 0.01,'y':0,'z':0});
        	break;
        case 69: /*e*/
        	g_amplitude += 0.1;
        	rotate({'x':0,'y':0,'z':-0.01});
        	break;
        case 68: /*d*/
        	g_amplitude -= 0.1;
        	rotate({'x':0,'y': 0.01,'z':0});
        	break;
        case 82: /*r*/
        	g_frequencyFactor += 0.1;
        	break;
        case 70: /*f*/
        	g_frequencyFactor -= 0.1;
        	break;
    }
	// console.log(g_octaves, g_period, g_amplitude, g_frequencyFactor);
}

document.addEventListener( 'keydown', onDocumentKeyDown, false );

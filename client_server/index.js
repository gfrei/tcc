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



var device_dict = {};
var browser_dict = {};

function sendToBrowserSocket(event, data) {
    for (var key in browser_dict) {
        if (browser_dict[key].connected) {
            browser_dict[key].emit(event, data);
        }
        else {
            console.log("  > Disconnected socket!")
            delete browser_dict[key];
        }
    }
}

io.on('connection', function (socket) {

    socket.on('ready', function (data) {
        if (data == 'device') {
            console.log('device  connected:', socket.id);
            device_dict[socket.id] = socket;
        }
        else if (data == 'browser'){
            console.log('browser connected:', socket.id);
            browser_dict[socket.id] = socket;
        }
    })


    // Device
    socket.on('device_ping', function (sent) {
        var receivedInServer = Date.now();
        socket.emit('server_ping', {
            t0 : sent,
            t1 : receivedInServer
        });
    });

    socket.on('device_add_speed', function (data) {
        console.log('device_add_speed', data);
        sendToBrowserSocket('move', data)
    });

    socket.on('device_reset_speed', function () {
        console.log('device_reset_speed');
        sendToBrowserSocket('reset', {})
    });

    socket.on('device_print', function (data) {
        console.log(data);
    })

    socket.on('device_battery_changed', function (data) {
        sendToBrowserSocket('update_battery', data)
        // { level: 68, isPlugged: true }
    })

    socket.on('device_acceleration', function (data) {
        sendToBrowserSocket('update_acceleration', data)
        // { x: -0.39, y: 0.06, z: 0.2, timestamp: 1476064230489 }
    })




    // Echo browser > server > browser
    socket.on('echo_move', function (data) {
        socket.emit('move', data);
    });

});

/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        // app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();

// Variables

var socket;
var default_port = 8000;
var watchID = null;

var speedX = {'x':1,'y':0,'z':0};
var speedY = {'x':0,'y':1,'z':0};
var speedZ = {'x':0,'y':0,'z':1};




// Auxiliar functions

function logInServer(message) {
    socket.emit('device_print', message);
    var msg = 'Log: ' + message;
    $('#log').text(msg);
}

// Unused

function validateIPaddress(ipaddress) {
    // if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
    if (/^192\.168?\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress)) {
        return (true)
    }
    console.log("You have entered an invalid IP address!")
    return (false)
}




// Accelerometer Toggle

function toggleAccelerometer(period) {
    var freq = ~~(1000 / period);
    if (watchID == null) {
        watchID = navigator.accelerometer.watchAcceleration(
            sendAcceration,
            sendAccError,
            { frequency: freq }
        );
        navigator.accelerometer.getCurrentAcceleration(sendAcceration, sendAccError);
    }
    else {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
}



// Socket emit functions
function addSpeed(speed_vector) {
    socket.emit('device_add_speed', speed_vector);
}

function resetSpeed() {
    socket.emit('device_reset_speed');
}

function sendAcceration(acceleration) {
    socket.emit('device_acceleration', acceleration)
}

function sendAccError() {
    logInServer('Accelerometer error.');
}

function emitBatteryStatus(status) {
    var data = {
        level : status.level,
        isPlugged : status.isPlugged
    }

    socket.emit('device_battery_changed', data)
}

function sendPing() {
    var timestamp = Date.now();
    socket.emit('device_ping', timestamp);
}

function localCalculation() {
    var t0 = Date.now();
    var r = 0;
    var i, j, k;
    for(i = 0; i < 1000000; i++) {
        for(i = 0; i < 10000000; i++) {
            for(i = 0; i < 10000000; i++) {
                r += (3 * i + (j + k / 2))% 103;
            }
        }
    }

    var t1 = Date.now();
    socket.emit('request_calculation');
    logInServer('Finished device calculation in ' + (t1 - t0));
}



// Socket events

function onServerConnect() {
    app.receivedEvent('deviceready');
    socket.emit('ready', 'device');
}

function onServerPing(data) {
    var dt = Date.now() - data.t0;
    logInServer('Ping: ' + dt);
}



function connectSocket(ipaddress, port) {
    if(validateIPaddress(ipaddress)) {
        if(socket != null) {
            console.log(socket);
            // socket.emit('device_disconnected');
            // socket.disconnect();
            // console.log(socket);
        }
        else{
            socket = io('http://' + ipaddress + ':' + port);

            socket.on('connect', onServerConnect);
            socket.on('server_ping', onServerPing);
            console.log(socket);
        }
    }
}

// Device Ready Event

document.addEventListener('deviceready', function() {

    $('#connect').submit(function (event) {
        var ip   = this.ip.value;
        var port = this.port.value;

        connectSocket(ip, port);

        return false;
    });
});

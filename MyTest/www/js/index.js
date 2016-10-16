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
        app.receivedEvent('deviceready');
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

var socket
var default_port = 8000;
var watchID = null;

var speedX = {'client_type':'device','x':1,'y':0,'z':0}
var speedY = {'client_type':'device','x':0,'y':1,'z':0}
var speedZ = {'client_type':'device','x':0,'y':0,'z':1}




document.addEventListener('deviceready', function() {
    socket = io('http://192.168.0.17:' + default_port);

    socket.on('connect', function() {
        socket.emit('ready', 'device');
    });

    window.addEventListener("batterystatus", onBatteryStatus, false);
});



// Unused

function validateIPaddress(ipaddress)   
{  
 if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress))  
  {  
    return (true)  
  }  
alert("You have entered an invalid IP address!")  
return (false)  
}  


function connectSocket(ipaddress, port) {
    if(validateIPaddress(ipaddress)) {
        if(socket != null) {
            socket.emit('device_disconnected');
            socket.disconnect();
            socket = null;
        }
        socket = io('http://' + ipaddress + ':' + port);
    }
}



// Aux

function logInServer(message) {
    socket.emit('device_print', message)
}



// Event Listeners functions

function onBatteryStatus(status) {
    var data = {
        level : status.level, 
        isPlugged : status.isPlugged
    }

    socket.emit('device_battery_changed', data)
}

function onAccSuccess(acceleration) {
    socket.emit('device_acceleration', acceleration)
}

function onAccError() {
    logInServer('Accelerometer error.');
}



// Socket functions

function toggleAccelerometer(period) {
    var freq = ~~(1000 / period);
    if (watchID == null) {
        watchID = navigator.accelerometer.watchAcceleration(
            onAccSuccess,
            onAccError,
            { frequency: freq }
        );
        navigator.accelerometer.getCurrentAcceleration(onAccSuccess, onAccError);
    }
    else {
        navigator.accelerometer.clearWatch(watchID);
        watchID = null;
    }
}

function addSpeed(speed_vector) {
    socket.emit('device_add_speed', speed_vector); 
}

function resetSpeed() {
    socket.emit('device_reset_speed'); 
}

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

// My vars

var socket

var spin  = {'client_type':'device','x':0.01,'y':0,'z':0}
var spin2 = {'client_type':'device','x':0,'y':0,'z':0.05}
var spin3 = {'client_type':'device','x':-0.01,'y':0,'z':-0.05}



document.addEventListener('deviceready', function() {

    socket = io('http://192.168.0.10:8000');
    socket.on('connect', function() {
        // socket.emit('order_move', spin); 
        socket.on('doge', function(text) {
            // alert(text);
        });
    });
});


function onSuccess(acceleration) {
    socket.emit('order_print', '~')
    socket.emit('order_print', 'Acceleration X: ' + acceleration.x)
    socket.emit('order_print', 'Acceleration Y: ' + acceleration.y)
    socket.emit('order_print', 'Acceleration Z: ' + acceleration.z)
    // socket.emit('order_print', 'Timestamp: '      + acceleration.timestamp)
}

function onError() {
    socket.emit('order_print', 'onError!');
}
var options = { frequency: 1000 };


var watchID = null;

function doSpin(move) {
    if (watchID == null) {
        watchID = navigator.accelerometer.watchAcceleration(
            onSuccess, 
            onError, 
            options
        );
    };
    navigator.accelerometer.getCurrentAcceleration(onSuccess, onError);
    socket.emit('order_move', move); 
    // window.open("http://www.w3schools.com", "_self");
}

function doReset() {
    navigator.accelerometer.clearWatch(watchID);
    watchID = null;
    socket.emit('order_reset'); 
}

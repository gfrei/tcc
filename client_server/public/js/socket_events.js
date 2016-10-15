//Socket functions

function rotate (data) {
    xRot += data.x
    yRot += data.y
    zRot += data.z
}

function reset_rotation () {
    xRot = 0
    yRot = 0
    zRot = 0
}

function update_colors(data) {
    var cap = 9
    var x = Math.min(Math.abs(data.x), cap)
    var y = Math.min(Math.abs(data.y), cap)
    var z = Math.min(Math.abs(data.z), cap)

    var weight = 5

    r = (weight * r + (x / cap)) / (weight + 1)
    g = (weight * g + (y / cap)) / (weight + 1)
    b = (weight * b + (z / cap)) / (weight + 1)

    hasNewColors = true
}

function update_rotation_and_colors (data) {
    var cap = 9
    var x = Math.min(data.x, cap)
    var y = Math.min(data.y, cap)
    var z = Math.max(2, Math.min(data.z, cap))

    var weight = 5

    xRot = y / 50
    yRot = x / 50

    r = (weight * r + (z / cap)) / (weight + 1)
    g = (weight * g + (z / cap)) / (weight + 1)
    b = (weight * b + (z / cap)) / (weight + 1)

    hasNewColors = true
}

function update_perlin_seed(data) {
    var cap = 9
    var y = Math.min(data.y, cap);

    seed = y/10;
    
    seed = data.y/10;
    hasNewSeed = true;
}



// Socket Events

socket.on('connect', function() {
    socket.emit('ready', 'browser');
});

socket.on('move', function (data) {
    rotate(data);
});

socket.on('reset', function () {
    reset_rotation();
});

socket.on('update_acceleration', function (data) {
    // update_rotation_and_colors(data);
    // update_colors(data);
    update_perlin_seed(data);
})

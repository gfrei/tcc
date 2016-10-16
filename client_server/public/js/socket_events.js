socket = io();

//Socket functions
// Terrain
function update_perlin_seed(data) {
    var value = 0;
    if (Math.abs(data.y) > 1) {
        value = data.y/100;
    }
    
    g_seed += value;
    g_hasNewSeed = true;
}

function update_octaves(data) {
    var value = 1;
    if (data.x > 0) { add_octave(value); }
    else { reduce_octave(value); }
}

function add_octave(value) {
    var octave_max = 6;
    g_octaves = Math.min(g_octaves + value, octave_max);
}

function reduce_octave(value) {
    var octave_min = 1;
    g_octaves = Math.max(g_octaves - value, octave_min);
}

function update_quality(data) {
    var add = -0.25;
    var newQuality = g_quality;

    if (data.x > 0) { add = 0.25; }

    newQuality += add;

    var min = 0.1;
    var max = 5;
    g_quality = Math.min(Math.max(newQuality, min), max);
}

function update_qualityFactor(data) {
    var add = -1;
    var newFactor = g_qualityFactor;

    if (data.x > 0) { add = 1; }

    newFactor += add;

    var min = 1;
    var max = 6;
    g_qualityFactor = Math.min(Math.max(newFactor, min), max);
}



// Cube
function rotate (data) {
    xRot += data.x;
    yRot += data.y;
    zRot += data.z;
}

function reset_rotation () {
    xRot = 0;
    yRot = 0;
    zRot = 0;
}

function update_colors(data) {
    var cap = 9;
    var x = Math.min(Math.abs(data.x), cap);
    var y = Math.min(Math.abs(data.y), cap);
    var z = Math.min(Math.abs(data.z), cap);

    var weight = 5;

    r = (weight * r + (x / cap)) / (weight + 1);
    g = (weight * g + (y / cap)) / (weight + 1);
    b = (weight * b + (z / cap)) / (weight + 1);

    hasNewColors = true;
}

function update_rotation_and_colors (data) {
    var cap = 9;
    var x = Math.min(data.x, cap);
    var y = Math.min(data.y, cap);
    var z = Math.max(2, Math.min(data.z, cap));

    var weight = 5;

    xRot = y / 50;
    yRot = x / 50;

    r = (weight * r + (z / cap)) / (weight + 1);
    g = (weight * g + (z / cap)) / (weight + 1);
    b = (weight * b + (z / cap)) / (weight + 1);

    hasNewColors = true;
}

// Socket Events

socket.on('connect', function() {
    socket.emit('ready', 'browser');
});

socket.on('move', function (data) {
    rotate(data);
    // update_octaves(data);
    update_quality(data);
    // update_qualityFactor(data);
});

socket.on('reset', function () {
    reset_rotation();
});

socket.on('update_acceleration', function (data) {
    update_rotation_and_colors(data);
    // update_colors(data);
    update_perlin_seed(data);
})

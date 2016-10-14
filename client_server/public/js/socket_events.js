
socket.on('connect', function() {
    socket.emit('ready', 'browser');
});

socket.on('move', function (data) {
    xRot += data.x
    yRot += data.y
    zRot += data.z
});

socket.on('reset', function () {
    xRot = 0
    yRot = 0
    zRot = 0
});

socket.on('update_acceleration', function (data) {
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
})

// socket.on('update_acceleration', function (data) {
//     var cap = 9
//     var x = Math.min(Math.abs(data.x), cap)
//     var y = Math.min(Math.abs(data.y), cap)
//     var z = Math.min(Math.abs(data.z), cap)

//     var weight = 5

//     r = (weight * r + (x / cap)) / (weight + 1)
//     g = (weight * g + (y / cap)) / (weight + 1)
//     b = (weight * b + (z / cap)) / (weight + 1)

//     hasNewColors = true
// })


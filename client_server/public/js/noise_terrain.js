

if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

// ----------------- //
// Global variables
// ----------------- //

g_hasNewSeed = false;
g_seed = 1;
g_octaves = 3;
g_period = 100;
g_amplitude = 0.5;
g_frequencyFactor = 0.6;

// ----------------- //
// Local variables
// ----------------- //

var clock = new THREE.Clock();
var perlin = new ImprovedNoise();

var container, stats;

var camera, controls, scene, renderer;

var modelMesh, terrainMesh;
var modelGeometry, terrainGeometry;

var geoSize = 750 * 4;
var worldWidth = 128;
var worldDepth = 128;
var worldHalfWidth = worldWidth / 2;
var worldHalfDepth = worldDepth / 2;

var needToRender = true;



// --------- //
// Functions
// --------- //

function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

    data = generatePerlinHeight( worldWidth, worldDepth );

    camera.position.y = 600;
    camera.position.z = 4000;


    controls = new THREE.FirstPersonControls( camera );

    controls.movementSpeed = 5000;
    controls.lookSpeed = 0.3;

    //

    modelGeometry = new THREE.PlaneGeometry( geoSize, geoSize, worldWidth - 1, worldDepth - 1 );
    modelGeometry.rotateX( - Math.PI / 2 );

    for ( var i = 0, l = modelGeometry.vertices.length; i < l; i ++ ) {
        modelGeometry.vertices[ i ].y = data[ i ] * 10;
    }

    modelMesh = new THREE.Mesh( modelGeometry, new THREE.MeshBasicMaterial( { 
        color : 0x0044ff,
        wireframe: true 
    }));
    // scene.add( modelMesh );


    terrainGeometry = new THREE.PlaneGeometry( geoSize, geoSize, worldWidth - 1, worldDepth - 1 );
    terrainGeometry.rotateX( - Math.PI / 2 );

    terrainMesh = new THREE.Mesh( terrainGeometry, new THREE.MeshBasicMaterial( { 
        color : 0x0044aa,
        wireframe: true 
    }));
    scene.add( terrainMesh );


    //

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xbfd1e5 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    container.innerHTML = "";

    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    //

    window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

    controls.handleResize();
}

function generatePerlinHeight( width, height, seed ) {
    var size = width * height;
    var data = new Uint8Array( size );

    var z = seed;
    if (!seed) {z = Math.random() * 100};

    var octaves = g_octaves;
    var frequency = 1 / g_period;
    var freqFactor = g_frequencyFactor;
    var amplitude = g_amplitude;

    for ( var j = 0; j < octaves; j ++ ) {
        for ( var i = 0; i < size; i ++ ) {

            var x = i % width;
            var y = ~~ ( i / width );

            var noise = perlin.noise( x * frequency, y * frequency, z );
            data[ i ] += Math.abs( (noise / frequency) * amplitude );
        }

        frequency *= 1 / freqFactor;
    }

    return data;
}

function updateHeight(seed) {
    data = generatePerlinHeight( worldWidth, worldDepth, seed );

    for ( var i = 0, l = modelGeometry.vertices.length; i < l; i ++ ) {
        modelGeometry.vertices[ i ].y = data[ i ] * 10;
    }

    modelMesh.geometry.verticesNeedUpdate = true;

    g_hasNewSeed = false
}


//


function animate() {
    requestAnimationFrame( animate );

    if (g_hasNewSeed) { updateHeight(g_seed) };

    if(needToRender) { render(); }
    stats.update();
}

function render() {

    needToRender = false;
    var delta = clock.getDelta();
    
    for ( var i = 0, l = terrainGeometry.vertices.length; i < l; i ++ ) {

        var w = 15;

        var terrainHeight = terrainGeometry.vertices[ i ].y;
        var modelHeight  = modelGeometry.vertices[ i ].y;
        var newHeight = (w * terrainHeight + modelHeight) / (w + 1);

        terrainGeometry.vertices[ i ].y = newHeight;

    }

    // Uncomment to control
    // controls.update( delta );

    terrainMesh.geometry.verticesNeedUpdate = true;

    renderer.render( scene, camera );

    needToRender = true;
}



// --- //
// Run
// --- //

init();
animate();

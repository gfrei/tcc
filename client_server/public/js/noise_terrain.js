

if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

var clock = new THREE.Clock();

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


// Global variables
hasNewSeed = false;
seed = 1;


init();
animate();

function init() {

    container = document.getElementById( 'container' );

    scene = new THREE.Scene();
    // scene.fog = new THREE.FogExp2( 0xaaccff, 0.0007 );

    camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );

    data = generateHeight( worldWidth, worldDepth );

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

function generateHeight( width, height, seed ) {

    var size = width * height;
    var data = new Uint8Array( size );
    var perlin = new ImprovedNoise();

    var z = seed;
    if (!seed) {z = Math.random() * 100};
    
    // Default
    // var octaves = 4;
    // var quality = 1;
    // var qualityFactor = 5;

    // Loucura
    // var octaves = 7;
    // var quality = 1;
    // var qualityFactor = 3;

    var octaves = 4;
    var quality = 0.5;
    var qualityFactor = 5;

    for ( var j = 0; j < octaves; j ++ ) {
        for ( var i = 0; i < size; i ++ ) {

            var x = i % width;
            var y = ~~ ( i / width );

            var noise = perlin.noise( x / quality, y / quality, z );
            data[ i ] += Math.abs( noise * quality * 1.75 );
        }

        quality *= qualityFactor;
    }

    return data;
}

function updateHeight(seed) {
    // console.log(seed);
    data = generateHeight( worldWidth, worldDepth, seed );

    for ( var i = 0, l = modelGeometry.vertices.length; i < l; i ++ ) {
        modelGeometry.vertices[ i ].y = data[ i ] * 10;
    }

    modelMesh.geometry.verticesNeedUpdate = true;

    hasNewSeed = false
}


//


function animate() {
    requestAnimationFrame( animate );

    if (hasNewSeed) { updateHeight(seed) };

    if(needToRender) { render(); }
    stats.update();
}

function render() {

    needToRender = false;
    var delta = clock.getDelta();
    
    for ( var i = 0, l = terrainGeometry.vertices.length; i < l; i ++ ) {

        var w = 10;

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
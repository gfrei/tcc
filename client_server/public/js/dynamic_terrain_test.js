
if ( ! Detector.webgl ) {

    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";

}

var container, stats;

var camera, controls, scene, renderer;

var mesh, texture, terrainGeometry, modelGeometry, material;

var worldWidth = 8;
var worldDepth = 8;
var planeSize = 750;
var worldHalfWidth = worldWidth / 2
var worldHalfDepth = worldDepth / 2;

var clock = new THREE.Clock();

init();
animate();
// render();


function render() {
    updated = false;
    var perlin = new ImprovedNoise();

    var delta = clock.getDelta(),
        time = clock.getElapsedTime() * 10;

    for ( var i = 0, l = terrainGeometry.vertices.length; i < l; i ++ ) {

        var x = terrainGeometry.vertices[ i ].x / worldWidth;
        var y = terrainGeometry.vertices[ i ].y / worldDepth;
        var z = terrainGeometry.vertices[ i ].z;

        var height = ( perlin.noise( x, y, 1 ) * 1.75 );
        terrainGeometry.vertices[ i ].y += 10 * height;

    }

    mesh.geometry.verticesNeedUpdate = true;

    renderer.render( scene, camera );

    updated = true;
}

function init() {

    scene = new THREE.Scene();

    container = document.getElementById( 'container' );

    camera = new THREE.PerspectiveCamera( 
        60, 
        window.innerWidth / window.innerHeight, 
        1, 
        20000 
    );

    camera.position.y = 200;
    camera.position.z = 1000;

    terrainGeometry = new THREE.PlaneGeometry( planeSize, planeSize, worldWidth - 1, worldDepth - 1 );
    terrainGeometry.rotateX( - Math.PI / 2 );

    for ( var i = 0, l = terrainGeometry.vertices.length; i < l; i ++ ) {

        terrainGeometry.vertices[ i ].y = 35 * Math.sin( i / 2 );

    }

    material = new THREE.MeshBasicMaterial( { color: 0x0044ff, wireframe: true } );

    mesh = new THREE.Mesh( terrainGeometry, material );
    scene.add( mesh );

    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor( 0xaaccff );
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

    // controls.handleResize();

}

//

var updated = true;

function animate() {

    requestAnimationFrame( animate );

    if(updated) {
        render();
        stats.update();
    }
}



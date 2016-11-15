var scene, camera, renderer;
var sphere, sphere;
var container, stats;

if ( ! Detector.webgl ) {
    Detector.addGetWebGLMessage();
    document.getElementById( 'container' ).innerHTML = "";
}

hasNewColors = false;

function updateSphereRotation(xRot, yRot, zRot) {
    sphere.rotation.x += xRot;
    sphere.rotation.y += yRot;
    sphere.rotation.z += zRot;
}

function updateSphereColor(r, g, b) {
    sphere.material.color.r = r;
    sphere.material.color.g = g;
    sphere.material.color.b = b;
}


function init() {

    scene = new THREE.Scene();

    var view_angle = window.innerWidth/window.innerHeight
    camera = new THREE.PerspectiveCamera( 75, view_angle, 0.1, 1000 );
    camera.position.z = 5;
    scene.add(camera);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //-------------------------------------------

    // create a point light
    var pointLight = new THREE.PointLight(0xFFFFFF);

    // set its position
    pointLight.position.x = 10;
    pointLight.position.y = 50;
    pointLight.position.z = 130;

    // add to the scene
    scene.add(pointLight);

    //-------------------------------------------

    // New Sphere
    var radius = 2;
    var segments = 16;
    var rings = 16;

    var sphereGeo = new THREE.SphereGeometry(radius, segments, rings);
    var sphereMaterial = new THREE.MeshLambertMaterial( {
        color: 0xCC0000,
        wireframe : true
    } );
    sphere = new THREE.Mesh( sphereGeo, sphereMaterial );
    scene.add( sphere );

    //-------------------------------------------

    container = document.getElementById( 'container' );

    container.innerHTML = "";

    container.appendChild( renderer.domElement );

    stats = new Stats();
    container.appendChild( stats.dom );

    //-------------------------------------------

    xRot = 0;
    yRot = 0;
    zRot = 0;

    r = 1;
    g = 1;
    b = 0;
}

function render() {
    stats.update();

    requestAnimationFrame( render );

    updateSphereRotation(xRot, yRot, zRot);
    if (hasNewColors) {
        updateSphereColor(r, g, b);
        hasNewColors = false;
    };

    renderer.render(scene, camera);
};


init();
render();

var scene, camera, renderer
var cube, sphere


function updateCubeRotation(xRot, yRot, zRot) {
    cube.rotation.x += xRot;
    cube.rotation.y += yRot;
    cube.rotation.z += zRot;
}

function updateCubeColor(r, g, b) {
    cube.material.color.r = r
    cube.material.color.g = g
    cube.material.color.b = b
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

    // New Cube
    // var geometry = new THREE.BoxGeometry( 1, 1, 1 );
    // var material = new THREE.MeshLambertMaterial( { 
    //     color: 0xffff00, 
    //     wireframe : true 
    // } );
    // cube = new THREE.Mesh( geometry, material );
    // scene.add( cube );

    // New Sphere
    var radius = 0.6;
    var segments = 16;
    var rings = 16;

    var sphereGeo = new THREE.SphereGeometry(radius, segments, rings)
    var sphereMaterial = new THREE.MeshLambertMaterial( { 
        color: 0xCC0000, 
        wireframe : true 
    } );
    cube = new THREE.Mesh( sphereGeo, sphereMaterial )
    scene.add( cube );

    //-------------------------------------------
    
    xRot = 0
    yRot = 0
    zRot = 0

    r = 1
    g = 1
    b = 0
}

function render() {
    requestAnimationFrame( render );

    updateCubeRotation(xRot, yRot, zRot);
    if (hasNewColors) {
        updateCubeColor(r, g, b);
        hasNewColors = false;
    };
    
    renderer.render(scene, camera);
};


init();
render();

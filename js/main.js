// GAME VARS

var color = {};
color.red = 0xf25346;
color.white = 0xd8d0d1;
color.brown = 0x59332e;
color.pink = 0xF5986E;
color.brownDark = 0x23190f;
color.blue = 0x68c3c0;

var OBJ = {};
var SCENE = {};

// ---------------------------

var controls = new function () {
    this.rotationSpeed = 0;
    this.camX = -30;
    this.camY = 60;
    this.camZ = 30;
}

var gui = new dat.GUI();
gui.add(controls, 'rotationSpeed', 0, 1);
gui.add(controls, 'camX', -100, 0);
gui.add(controls, 'camY', 0, 100);
gui.add(controls, 'camZ', 0, 100);

// ---------------------------------

var scene = new THREE.Scene();

 scene.fog=new THREE.Fog( 0xf7d9aa, 0.015, 160 );

var axes = new THREE.AxisHelper(20);
scene.add(axes);

var addCamera = function () {
    SCENE.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    SCENE.camera.position.x = -30;
    SCENE.camera.position.y = 60;
    SCENE.camera.position.z = 30;
    SCENE.camera.lookAt(scene.position);
}

var addRenderer = function () {
    SCENE.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    SCENE.renderer.setSize(window.innerWidth, window.innerHeight);
    SCENE.renderer.shadowMap.enabled = true;
}

var addPlane = function () {
    var planeGeo = new THREE.PlaneGeometry(50, 50);
    var planeMat = new THREE.MeshLambertMaterial({color: color.blue});
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.receiveShadow = true;

    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;

    scene.add(plane);
};

var addCube = function () {
    var cubeGeo = new THREE.BoxGeometry(5, 5, 5);
    var cubeMat = new THREE.MeshLambertMaterial({color: color.red});
    OBJ.cube = new THREE.Mesh(cubeGeo, cubeMat);
    OBJ.cube.castShadow = true;
    OBJ.cube.position.x = -20;
    OBJ.cube.position.y = 10;
    OBJ.cube.position.z = 10;
    scene.add(OBJ.cube);
};

var addLight = function () {
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add(spotLight);
}

var loop = function () {
    OBJ.cube.rotation.x += controls.rotationSpeed;
    OBJ.cube.rotation.z += controls.rotationSpeed;
    OBJ.cube.position.x += controls.rotationSpeed;
    SCENE.camera.position.x = controls.camX;
    SCENE.camera.position.y = controls.camY;
    SCENE.camera.position.z = controls.camZ;
    requestAnimationFrame(loop);
    SCENE.renderer.render(scene, SCENE.camera);
}

var renderScene = function () {
    addLight();
    addCamera();
    addRenderer();
    addPlane();
    addCube();
    loop();
}

renderScene();

document.getElementById('gameWrapper').appendChild(SCENE.renderer.domElement);


var scene = new THREE.Scene();

// dev

var axes = new THREE.AxisHelper(20);
scene.add(axes);

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


var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.x = -30;
camera.position.y = 60;
camera.position.z = 30;
camera.lookAt(scene.position);


var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// ADD PLANE

var planeGeo = new THREE.PlaneGeometry(50, 50);
var planeMat = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
var plane = new THREE.Mesh(planeGeo, planeMat);
plane.receiveShadow = true;

plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;

scene.add(plane);

var cubeGeo = new THREE.BoxGeometry(4, 4, 4);
var cubeMat = new THREE.MeshLambertMaterial({color: 0xff0000});
var cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true;
scene.add(cube);

cube.position.x = -20;
cube.position.y = 10;
cube.position.z = 10;

// CAMERA

// LIGHT
var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -40, 60, -10 );
spotLight.castShadow = true;

scene.add(spotLight);

var renderScene = function () {

    cube.rotation.x += controls.rotationSpeed;
    cube.rotation.z += controls.rotationSpeed;
    cube.position.x += controls.rotationSpeed;
    camera.position.x = controls.camX;
    camera.position.y = controls.camY;
    camera.position.z = controls.camZ;

    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
}

renderScene();

document.getElementById('gameWrapper').appendChild(renderer.domElement);

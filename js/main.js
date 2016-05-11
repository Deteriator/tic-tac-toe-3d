
var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)

var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0xffffff, 1.0));
renderer.setSize(window.innerWidth, window.innerHeight);

// ADD PLANE

var planeGeo = new THREE.PlaneGeometry(50, 50);
var planeMat = new THREE.MeshLambertMaterial({color: 0xEEEEEE});
var plane = new THREE.Mesh(planeGeo, planeMat);

plane.rotation.x = -0.5 * Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;


scene.add(plane);

var axes = new THREE.AxisHelper(20);
scene.add(axes);

var cubeGeo = new THREE.BoxGeometry(4, 4, 4);
var cubeMat = new THREE.MeshLambertMaterial({color: 0xff0000});
var cube = new THREE.Mesh(cubeGeo, cubeMat);

scene.add(cube);

cube.position.x = -20;
cube.position.y = 7;
cube.position.z = 10;

camera.position.x = -30;
camera.position.y = 40;
camera.position.z = 30;

camera.lookAt(scene.position);

// LIGHT

var spotLight = new THREE.SpotLight( 0xffffff );
spotLight.position.set( -40, 60, -10 );
scene.add(spotLight);

document.getElementById('gameWrapper').appendChild(renderer.domElement);

renderer.render(scene, camera);

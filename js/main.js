var scene = new THREE.Scene();

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();

renderer.setClearColor(0xEEEEEE, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMapEnabled = true;

// AXES

var axes = new THREE.AxisHelper( 20 );
scene.add(axes);

// PLANE

var planeGeometry = new THREE.PlaneGeometry(60, 20);
var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
var plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.receiveShadow = true;

plane.rotation.x = -0.5*Math.PI;
plane.position.x = 0;
plane.position.y = 0;
plane.position.z = 0;

scene.add(plane);

// CUBE

var cubeGeometry = new THREE.CubeGeometry(4, 4, 4);
var cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;


cube.position.x = -4;
cube.position.y = 3;
cube.position.z = 0;

scene.add(cube);

// SPHERE

var sphereGeom = new THREE.SphereGeometry(4, 20, 20);
var sphereMat = new THREE.MeshLambertMaterial({color: 0x7777ff});
var sphere = new THREE.Mesh(sphereGeom, sphereMat);
sphere.castShadow = true;

sphere.position.x = 20;
sphere.position.y = 4;
sphere.position.z = 2;

scene.add(sphere)

// ..

// CAMERA

camera.position.x = -40;
camera.position.y = 60;
camera.position.z = 30;

camera.lookAt(scene.position);

// LIGHTS

var spotLight = new THREE.SpotLight(0xffffff);
spotLight.position.set(-40, 60, -10);
spotLight.castShadow = true;
scene.add(spotLight);


//  END
document.getElementById('gameWrapper').appendChild(renderer.domElement);
renderer.render(scene, camera);

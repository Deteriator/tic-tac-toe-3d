// MODEL GLOBALS

var board = {};
    board.turn = 'o';
    board.boxes = [null, null, null, null, null, null, null, null, null];
    board.active = true;
    board.end = false;
    board.winPos = [];

// VIEW GLOBALS
var OBJ = {};
var SCENE = {};
var RENDER = {};
var color = {};
    color.red = 0xf25346;
    color.white = 0xd8d0d1;
    color.brown = 0x59332e;
    color.pink = 0xF5986E;
    color.brownDark = 0x23190f;
    color.blue = 0x68c3c0;


// ---------------------------
// DEV ***********************
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


var getObjectsByName = function (sceneObject, name) {
    var objects = [];
    sceneObject.children.forEach(function(item) {
        var slicedName;
        if(item.name) {
            slicedName = item.name.slice(0, item.name.indexOf('-'));
            if(slicedName === name) {
                objects.push(item);
            }
        }
    });
    return objects;
}

// ---------------------------------

// SCENE

var scene = new THREE.Scene();
scene.fog = new THREE.Fog( 0xf7d9aa, 0.015, 160 );

// var axes = new THREE.AxisHelper(20);
// scene.add(axes);

// MODEL

var updateModel = function (model, boxId) {
    var newModel = model;
    if (newModel.boxes[boxId] === null) {
        if(newModel.active) { // if model active
            // updateModel: box
            newModel.boxes[boxId] = newModel.turn;
            // ifGameOver deactivate model
            if(isWin(newModel).state === 'draw') {
                newModel.active = false;
            }
            if(isWin(newModel).state === 'win') {
                newModel.active = false;
                newModel.winPos = isWin(newModel).winPositions;
            }
            // updateModel: turn
            if(newModel.turn === 'x') {
                newModel.turn = 'o';
            } else {
                newModel.turn = 'x';
            }
        } else { // if the model has been deactivated
        }
    }
    return newModel;
}


//  THE MODEL SHOULD HAVE DATA FOR A WIN ANIMATION
//      - save winning coordinates in model

var isWin = function (model) {

    var drawCounter = 0;
    var topLeft = model.boxes[0];
    var topMid = model.boxes[1];
    var topRight = model.boxes[2];
    var midLeft = model.boxes[3];
    var midMid = model.boxes[4];
    var midRight = model.boxes[5];
    var botLeft = model.boxes[6];
    var botMid = model.boxes[7];
    var botRight = model.boxes[8];

    if ((topLeft !== null) && (topMid !== null) && (topRight !== null)) {
        if((topLeft === topMid) && (topMid === topRight)) return {state: 'win', winPositions: [0, 1, 2]};
    };
    if ((midLeft !== null) && (midMid !== null) && (midRight !== null)) {
        if((midLeft === midMid) && (midMid === midRight)) return {state: 'win', winPositions: [2, 3, 4]};
    };
    if ((botLeft !== null) && (botMid !== null) && (botRight !== null)) {
        if((botLeft === botMid) && (botMid === botRight)) return {state: 'win', winPositions: [5, 6, 7]};
    };
    // // VERTICAL
    if ((topLeft !== null) && (midLeft !== null) && (botLeft !== null)) {
        if((topLeft === midLeft) && (midLeft === botLeft)) return {state: 'win', winPositions: [0, 3, 6]};
    };
    if ((topMid!== null) && (midMid!== null) && (botMid!== null)) {
        if((topMid=== midMid) && (midMid=== botMid)) return {state: 'win', winPositions: [1, 4, 7]};
    };
    if ((topRight !== null) && (midRight !== null) && (botRight !== null)) {
        if((topRight === midRight) && (midRight === botRight)) return {state: 'win', winPositions: [2, 5, 8]};
    };
    // // CROSS
    if ((topLeft !== null) && (midMid !== null) && (botRight !== null)) {
        if((topLeft === midMid) && (midMid === botRight)) return {state: 'win', winPositions: [0, 4, 8]};
    };
    if ((topRight !== null) && (midMid !== null) && (botLeft !== null)) {
        if((topRight === midMid) && (midMid === botLeft)) return {state: 'win', winPositions: [2, 4, 6]};
    };


    for (var i = 0; i < model.boxes.length; i += 1) {
        if (model.boxes[i] !== null) drawCounter += 1;
        if (drawCounter === (model.boxes.length)) {
            return {state: 'draw', winPositions: [0, 1, 2]};
        }

    }

    return false;
}

var checkState = function (model) {

    var topLeft = model.boxes[0];
    var topMid = model.boxes[1];
    var topRight = model.boxes[2];
    var midLeft = model.boxes[3];
    var midMid = model.boxes[4];
    var midRight = model.boxes[5];
    var botLeft = model.boxes[6];
    var botMid = model.boxes[7];
    var botRight = model.boxes[8];

    if ((topLeft !== null) && (topMid !== null) && (topRight !== null)) {
        if((topLeft === topMid) && (topMid === topRight)) return true;
    };
    if ((midLeft !== null) && (midMid !== null) && (midRight !== null)) {
        if((midLeft === midMid) && (midMid === midRight)) return true;
    };
    if ((botLeft !== null) && (botMid !== null) && (botRight !== null)) {
        if((botLeft === botMid) && (botMid === botRight)) return true;
    };
    // // VERTICAL
    if ((topLeft !== null) && (midLeft !== null) && (botLeft !== null)) {
        if((topLeft === midLeft) && (midLeft === botLeft)) return true;
    };
    if ((topMid!== null) && (midMid!== null) && (botMid!== null)) {
        if((topMid=== midMid) && (midMid=== botMid)) return true;
    };
    if ((topRight !== null) && (midRight !== null) && (botRight !== null)) {
        if((topRight === midRight) && (midRight === botRight)) return true;
    };
    // // CROSS
    if ((topLeft !== null) && (midMid !== null) && (botRight !== null)) {
        if((topLeft === midMid) && (midMid === botRight)) return true;
    };
    if ((topRight !== null) && (midMid !== null) && (botLeft !== null)) {
        if((topRight === midMid) && (midMid === botLeft)) return true;
    };

    return false;
}

// RENDER

var addCamera = function () {
    SCENE.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    SCENE.camera.position.x = -30;
    SCENE.camera.position.y = 60;
    SCENE.camera.position.z = 30;
    SCENE.camera.lookAt(scene.position);
};

var addRenderer = function () {
    SCENE.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    SCENE.renderer.setSize(window.innerWidth, window.innerHeight);
    SCENE.renderer.shadowMap.enabled = true;
};

var addPlane = function () {
    var planeGeo = new THREE.PlaneGeometry(50, 50);
    var planeMat = new THREE.MeshLambertMaterial({color: color.blue});
    var plane = new THREE.Mesh(planeGeo, planeMat);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);
};

var addGrid = function () {
    var cubeId = 0;
    for (var h = 0; h < 3; h += 1) {
        for (var w = 0; w < 3; w += 1) {
            addCube(w, h, cubeId)
            cubeId += 1;
        }
    }
};

var addCube = function (w, h, cubeId) {
    var cubeGeo = new THREE.BoxGeometry(5, 5, 5);
    var cubeMat = new THREE.MeshLambertMaterial({color: color.red});
    OBJ.cube = new THREE.Mesh(cubeGeo, cubeMat);
    OBJ.cube.castShadow = true;
    OBJ.cube.position.x = -13 + (h * 8);
    OBJ.cube.position.y = 10;
    OBJ.cube.position.z = -4.5 + (w * 8);
    OBJ.cube.name = 'cube-' + cubeId;
    scene.add(OBJ.cube);
}

var addLight = function () {
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add(spotLight);
}

var updateColor = function (object) {
    object.material.color = new THREE.Color(color.brown);
};

// I want the mode to update all animating objects
// right now I have a rotateCube() function of animateFunctions
// listening for changes in the model
// you should have a animateFunction as a a 'gateway' for all you ranimations

/*

function animateObjects(scene, model) {
    rotateCubes(scene, model);
    sinkCubes(scene, model);
}

// basically a bunch of if statements in each of the functions and will
// if's are just checking the mode

*/

var rotateCube = function (model, object) {
    if(object.name.slice(0, 4) === "cube") {
        var cubeId = object.name.slice(5, object.name.length);
        var cubeData = model.boxes[cubeId];
        if(cubeData !== null) {
            object.rotation.x += 0.01 * Math.random();
            object.rotation.z += 0.01 * Math.random();
            object.rotation.y += 0.01 * Math.random();
        } else {
        }
    }
};

var sinkCube = function (model, object) {
    // which cubes should i sink?
    var winPosArr = model.winPos;
    if(winPosArr.length >= 3) {
        // select those cubes
        var matchLength = 0;
        winPosArr.forEach(function(pos) {
            var winCubeName = 'cube-' + pos;
            if(winCubeName !== object.name) {
                matchLength += 1;
            }
        });

        if(matchLength === winPosArr.length) {
            // console.log('Moving ' + object.name);
            object.position.y -= 0.2;
        }
    }
}

var changeCubeColor = function (sceneObject, model) {
    sceneObject.children.forEach(function(object) {
        if(object.name.slice(0, 4) === "cube") {
            var cubeId = object.name.slice(5, object.name.length);
            var cubeData = model.boxes[cubeId];
            if(cubeData !== null) {
                if(cubeData === 'x') {
                    object.material.color = new THREE.Color(color.pink);
                } else {
                    object.material.color = new THREE.Color(color.brown);
                }
            }

        }
    });
};


var animateObjects = function (sceneObject, model, callback) {
    sceneObject.forEach(function(object) {
        callback(model, object);
    })
};

var animateObjects2 = function () {

};

var updateRender = function (sceneObject, model) {
    changeCubeColor(sceneObject, model);
}

// EVENTS --------------------

var clickHandler = function (evt) {
    // vector is created based on the position that
    // we've clicked on, on the screen.

    var vector = new THREE.Vector3(
        (event.clientX / window.innerWidth ) * 2 - 1,
       -(event.clientY / window.innerHeight ) * 2 + 1, 0.5);

    //with the unprojectVector function we convert the
    //clicked position on the screen, to coordinates in our Three.js scene.

    vector = vector.unproject(SCENE.camera);

    //send out a ray into the world from the position we've clicked on,
    //on the screen.

    var raycaster = new THREE.Raycaster(SCENE.camera.position, vector.sub(SCENE.camera.position).normalize());

    // get the clicked object if it is of the type we specify ie. name = 'cube';

    var intersectCube = raycaster.intersectObjects(getObjectsByName(scene, 'cube'));

    // -------------------------------------------------

    // if we clicked on the cube object then;

    var newModel = board;

    var selectedCubeId, selectedObject;

    if (intersectCube.length !== 0) {
        selectedCubeId = intersectCube[0].object.name.slice(5, 6);
        selectedObject = intersectCube[0].object;
        newModel = updateModel(board, selectedCubeId);
    } else if (false) {
        // if clicked on another element, do something
    } else if (false) {
        // same same
    }
    updateRender(scene, newModel);
};

var loop = function () {
    OBJ.cube.rotation.x += controls.rotationSpeed;
    OBJ.cube.rotation.z += controls.rotationSpeed;
    OBJ.cube.position.x += controls.rotationSpeed;
    SCENE.camera.position.x = controls.camX;
    SCENE.camera.position.y = controls.camY;
    SCENE.camera.position.z = controls.camZ;
    animateObjects(scene.children, board, rotateCube);
    animateObjects(getObjectsByName(scene, 'cube'), board, sinkCube);
    requestAnimationFrame(loop);
    SCENE.renderer.render(scene, SCENE.camera);
}

var renderScene = function () {
    addLight();
    addCamera();
    addRenderer();
    addPlane();
    addGrid();
    loop();
    getObjectsByName(scene, 'cube');
}

renderScene();

document.getElementById('gameWrapper').appendChild(SCENE.renderer.domElement);
document.addEventListener('mousedown', clickHandler, false);

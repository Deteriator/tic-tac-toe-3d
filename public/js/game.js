
const ArrforEachProto = Array.prototype.forEach;

// -----------------------------------------------------------------------------
// *****************************************************************************
// MODEL ***********************************************************************
// *****************************************************************************
// -----------------------------------------------------------------------------

const playerO = 'o'
const playerX = 'x'

// board constructor
const createBoard = () => {
  return {
    turn        : playerO,
    boxes       : (new Array(9)).fill(null),
    active      : true,
    cutscene    : false,
    end         : false,
    winPos      : [],
  }
}

const board = createBoard()

const resetModel = (model) => {
    model = createBoard()
}

const updateModel = (model, boxId) => {
    var model = model
    // Ignore if box already clicked or game not active
    if (model.boxes[boxId] !== null || !model.active) {
      return model
    }

    // updateModel: box
    model.boxes[boxId] = model.turn;

    // ifGameOver deactivate model
    if ( isWin(model).state === 'draw' ) {
        model.active = false
        return model
    }

    // win condition
    if ( isWin(model).state === 'win' ) {
        model.active = false
        model.winPos = isWin(model).winPositions
        model.cutscene = 'sink'
        return model
    }

    // updateModel: turn
    if( model.turn === playerX ) {
        model.turn = playerO
    } else {
        model.turn = playerX
    }

    return model;
}

const isWin = (model) => {
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

    // var winStates = [[0, 1, 2],
    //                  [3, 4, 5],
    //                  [6, 7, 8],
    //                  [0, 3, 6],
    //                  [1, 4, 7],
    //                  [2, 5, 8],
    //                  [0, 4, 8],
    //                  [2, 4, 6]]
    //
    // winStates.forEach(function(state){
    //     // loop through win states
    //     // check to see if the win states are satisified
    //     // append to a counter
    //     state.forEach(function(pos) {
    //         var currentBox = model.boxes[pos];
    //
    //     })
    //
    //     // if its 3 then then a win state has been found
    // })


    if ((topLeft !== null) && (topMid !== null) && (topRight !== null)) {
        if((topLeft === topMid) && (topMid === topRight)) return {state: 'win', winPositions: [0, 1, 2]};
    };
    if ((midLeft !== null) && (midMid !== null) && (midRight !== null)) {
        if((midLeft === midMid) && (midMid === midRight)) return {state: 'win', winPositions: [3, 4, 5]};
    };
    if ((botLeft !== null) && (botMid !== null) && (botRight !== null)) {
        if((botLeft === botMid) && (botMid === botRight)) return {state: 'win', winPositions: [6, 7, 8]};
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

// -----------------------------------------------------------------------------
// *****************************************************************************
// 3D GAME *********************************************************************
// *****************************************************************************
// -----------------------------------------------------------------------------

const OBJ = {}
const SCENE = {}
const RENDER = {}
var scene;

const color = {
  red         : 0xf25346,
  white       : 0xd8d0d1,
  brown       : 0x59332e,
  pink        : 0xF5986E,
  brownDark   : 0x23190f,
  blue        : 0x68c3c0,
}

// DEV *************************************************************************

const controls = new function () {
    this.rotationSpeed = 0
    this.camX = -30
    this.camY = 60
    this.camZ = 30
}

const createGUIHelper = () => {
    const gui = new dat.GUI();

    [ [ 'rotationSpeed', 0, 1 ]
    , [ 'camX', -100, 0 ]
    , [ 'camY', 0, 100 ]
    , [ 'camZ', 0, 100 ]
    ]
    .forEach( ([prop, low, high]) => {
        gui.add( controls, prop, low, high );
    })
};

// UTIL ************************************************************************

const getObjectsByName = (sceneObject, name) => {
    return sceneObject.children.filter(item => {
      if (!item.name) { return false }
      return item.name.split('-')[0] === name
    })
}

// ANIMATION MODEL *************************************************************

const updateAnimationModel = (model) => {

    var newModel = model;
    var cubeAmount = getObjectsByName(scene, 'cube').length;
    var sinkCounter = 0, riseCounter = 0;


    scene.children.forEach((object) => {
        // cube objects
        if (object.name.slice(0, object.name.indexOf('-')) === 'cube') {
            // if sunk, then turn 'rise' switch on
            if (object.position.y <= -4) {
                sinkCounter += 1;
            }
            // if risen, turn cutscene to false
            if (object.position.y > 10 && model.cutscene !== "sink") {
                riseCounter += 1;
            }
        }
        // other objects to come
    });

    if(sinkCounter === cubeAmount) {
        model.cutscene = 'rise';
        model.boxes = [null, null, null, null, null, null, null, null, null];
    }

    if (riseCounter === cubeAmount) {
        model.cutscene = false;
        model.active = true;
    }

    return newModel;
}

// RENDER **********************************************************************

const addCamera = () => {
    SCENE.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100)
    SCENE.camera.position.x = -30;
    SCENE.camera.position.y = 60;
    SCENE.camera.position.z = 30;
    SCENE.camera.lookAt(scene.position);
};

const addRenderer = () => {
    SCENE.renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    SCENE.renderer.setSize(window.innerWidth, window.innerHeight);
    SCENE.renderer.shadowMap.enabled = true;
};

const addPlane = () => {
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

const addGrid3D = () => {
    var cubeId = 0;
    for (var h = 0; h < 3; h += 1) {
        for (var w = 0; w < 3; w += 1) {
            addCube(w, h, cubeId);
            cubeId += 1;
        }
    }
};

const addCube = (w, h, cubeId) => {
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

const addLight = () => {
    var spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( -40, 60, -10 );
    spotLight.castShadow = true;
    scene.add(spotLight);
}

const updateColor = (object) => {
    object.material.color = new THREE.Color(color.brown);
};

const rotateCube = (model, object) => {
        var cubeId = object.name.slice(5, object.name.length);
        var cubeData = model.boxes[cubeId];
        if(cubeData !== null) {
            object.rotation.x += 0.01 * Math.random();
            object.rotation.z += 0.01 * Math.random();
            object.rotation.y += 0.01 * Math.random();
        } else {
        }
};

const sinkCube = (model, cube) => {
    if(model.cutscene === 'sink') {
        var winPosArr = model.winPos;
        if(winPosArr.length >= 3) {
            // 1. SINK THE 'NON-WIN' CUBES FIRST
            // if the current cube is not any of the names in the win
            // position than sink the cube
            var matchLength = 0;
            winPosArr.forEach(function(pos) {
                var winCubeName = 'cube-' + pos;
                if(winCubeName !== cube.name) {
                    matchLength += 1;
                }
            });
            // THE 'NON WIN CUBES'
            if(matchLength === winPosArr.length) {
                if (cube.position.y >= -4) {
                    cube.position.y -= 0.1 * Math.random() + 0.1;
                }
            // THE WIN CUBES
            } else {
                // SINK WIN CUBES
                if (cube.position.y >= -4) {
                    cube.position.y -= 0.1 * Math.random();
                }
            }
        }
    }

    // if all cubes are sinked rotate them to the
    // original position
    if (model.cutscene === 'rise') {
        cube.position.y += 0.1 * Math.random();
        cube.rotation.x = 0;
        cube.rotation.z = 0;
        cube.rotation.y = 0;
        cube.material.color = new THREE.Color(color.red);
    }

    if (model.cutscene === false) {

    }
}

const changeCubeColor = (sceneObject, model) => {
    sceneObject.children.forEach(function(object) {
        if(object.name.slice(0, 4) === "cube") {
            var cubeId = object.name.slice(5, object.name.length);
            var cubeData = model.boxes[cubeId];
            if(cubeData !== null) {
                if(cubeData === playerX) {
                    object.material.color = new THREE.Color(color.pink);
                } else {
                    object.material.color = new THREE.Color(color.brown);
                }
            }

        }
    });
};

const animateObjects = (sceneObject, model, callback) => {
    sceneObject.forEach((object) => {
        callback(model, object);
    })
};

const updateAnimation = (model) => {
    var newModel = updateAnimationModel(model);
    animateObjects(getObjectsByName(scene, 'cube'), model, rotateCube);
    animateObjects(getObjectsByName(scene, 'cube'), model, sinkCube);
};

const updateRender3D = (sceneObject, model) => {
    changeCubeColor(sceneObject, model);
}

// EVENTS **********************************************************************

const clickHandler3D = (evt) => {
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
        console.log(selectedCubeId);
        newModel = updateModel(board, selectedCubeId);
    } else if (false) {
        // if clicked on another element, do something
    } else if (false) {
        // same same
    }
    updateRender3D(scene, newModel);
};

var loop3D = () => {
    OBJ.cube.rotation.x += controls.rotationSpeed;
    OBJ.cube.rotation.z += controls.rotationSpeed;
    OBJ.cube.position.x += controls.rotationSpeed;
    SCENE.camera.position.x = controls.camX;
    SCENE.camera.position.y = controls.camY;
    SCENE.camera.position.z = controls.camZ;
    updateAnimation(board);
    requestAnimationFrame(loop3D);
    SCENE.renderer.render(scene, SCENE.camera);
}

var renderScene3D = () => {
    addLight();
    addCamera();
    addRenderer();
    addPlane();
    addGrid3D();
    loop3D();
    getObjectsByName(scene, 'cube');
}

const init3D = () => {
    scene = new THREE.Scene();
    scene.fog = new THREE.Fog( 0xf7d9aa, 0.015, 160 );
    renderScene3D();
    document
        .getElementById('gameWrapper')
        .appendChild(SCENE.renderer.domElement);
    document
        .addEventListener('mousedown', clickHandler3D, false);
    createGUIHelper();
}

// init3D();

// -----------------------------------------------------------------------------
// *****************************************************************************
// 2D GAME *********************************************************************
// *****************************************************************************
// -----------------------------------------------------------------------------

// RENDER **********************************************************************

const renderBox = (currentPlay, id, domNode) => {
    // with the box id and current
    // if x do this to id
    // if y do that to id
    console.log(currentPlay, id);

    var box = document.createElement('div');
    // var idString = "r" + rowIndex + "-c" + boxIndex + "-i" + boxId;
    box.className = "box";
    box.innerHTML = "box";
    box.dataset.box = id;

    domNode.appendChild(box);
}

const render2D = (model, domNode) => {
    var model = model.boxes;
    domNode.innerHTML = '';
    model.forEach((currentPlay, index) => {
        renderBox(currentPlay, index, domNode);
    });
}

// addListener()
// eventually you want to only add event listeners to things that are
// active

const addListener = (action, callback) => {
    return (node, i) => {
        node.addEventListener(action, callback);
    }
}

const forEachElementByClass = (className, callback) => {
    var boxNodes = document.getElementsByClassName(className);
    return ArrforEachProto.apply(boxNodes, [callback]);
}

// EVENTS **********************************************************************

const boxClick = (gameNode) => {
    return (event) => {
        var clickedNode = event.target;
        var clickedId = clickedNode.dataset.box;
        updateModel(board, clickedId);
        render2D(board, gameNode);
        forEachElementByClass('box', addListener('click', boxClick(gameNode)));
    }
}

const init2D = () => {
    var gameWrapper = document.getElementById('gameWrapper');
    var game2D = document.createElement('div')
        gameWrapper.appendChild(game2D);
    render2D(board, game2D);
    forEachElementByClass('box', addListener('click', boxClick(game2D)));
}

init2D();

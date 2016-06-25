// ANIMATION *******************************************************************

const updateControls = (clock, controls) => {
    var delta = clock.getDelta();
    controls.update(delta);
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
                    cube.position.y -= 0.09 * Math.random();
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

const rotateSky = (sky) => {
    sky.rotation.y += 0.002;
}

const roatateWater = (water) => {
    // water.rotation.z += 0.001;
    // water.rotation.x += 0.001;
    water.rotation.y += 0.008;
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
    roatateWater(OBJ.water);
    rotateSky(OBJ.sky);
    animateObjects(getObjectsByName(scene, 'cube'), model, rotateCube);
    animateObjects(getObjectsByName(scene, 'cube'), model, sinkCube);

};

const updateRender3D = (sceneObject, model) => {
    changeCubeColor(sceneObject, model);
}

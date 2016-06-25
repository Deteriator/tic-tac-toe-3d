const renderState = (model, domNode) => {
    var gameState = document.createElement('div');
        gameStateString = " "
        gameStateString += model.turn
        gameStateString += ', ' + model.active
        gameStateString += ', ' + model.cutscene
        gameStateString += ', ' + model.end
        gameStateString += ', ' + model.winPos
        gameState.innerHTML = gameStateString;
    gameWrapper.appendChild(gameState);
}

const appendChildDiv = (parent, className, htmlContent) => {
    var child = document.createElement('div');
    child.className = className;
    child.innerHTML = htmlContent;
    return parent.appendChild(child);
}

const renderBox = (currentPlay, id, domNode) => {
    var box = document.createElement('div');
    var htmlContent = currentPlay ? currentPlay : "box";
    box.className = "box";
    box.dataset.box = id;
    domNode.appendChild(box);
    appendChildDiv(appendChildDiv(box, 'child', ''), 'innerChild', htmlContent);
}

const render2D = (model, domNode) => {
    var currentPositions = model.boxes;
    domNode.innerHTML = '';
    currentPositions.forEach((currentPlay, index) => {
        renderBox(currentPlay, index, domNode);
    });
    renderState(model, domNode);
}

const addListener = (action, callback) => {
    return (node, i) => {
        node.addEventListener(action, callback);
    }
}

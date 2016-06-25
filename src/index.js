import React from 'react'
import ReactDOM from 'react-dom'
import { hashHistory, Router, Route, Redirect, Link } from 'react-router';
import './lib/socket.io.js'
var socket = io();

class App extends React.Component {
    constructor() {
        super();
    }

    render () {
        return (
            <div>
                <Game />
                hi
            </div>
        )
    }
}

const Game = () => {
    return (
        <div id="gameWrapper">
        </div>
    )
}

ReactDOM.render(<App/> , document.getElementById('master'))

// ------------------------------------------------------------------

import './game/util.js';
import './game/model.js';

// import './game/3d/model.js';
// import './game/3d/render.js';
// import './game/3d/animation.js';
// import './game/3d/events.js';
//
// import './game/2d/model.js';
// import './game/2d/render.js';
// import './game/2d/events.js';
//
// import './game/init.js';

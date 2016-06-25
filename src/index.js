import './game/test.js'
import React from 'react'
import ReactDOM from 'react-dom'
import { hashHistory, Router, Route, Redirect, Link } from 'react-router';

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

// using react would be
//

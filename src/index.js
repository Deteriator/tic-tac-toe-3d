import React from 'react'
import ReactDOM from 'react-dom'


class App extends React.Component {

    constructor() {
        super();
    }

    render () {
        return (
            <div>
                <Game />
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

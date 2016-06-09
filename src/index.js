import React from 'react'
import ReactDOM from 'react-dom'



const Bottle = () => {
    return (
        <div id="bottle">
            <ul>
                <li>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fuga saepe, blanditiis earum id inventore odit molestiae maxime minima molestias itaque eaque, tempora quos accusantium eligendi animi quisquam harum eius laudantium.
                </li>
                <li>Magnam, quam, quaerat qui ratione dignissimos officiis alias optio sapiente illo dicta voluptas unde dolor autem, ullam suscipit consectetur sit eum dolorum officia. Quae voluptatum, natus vitae iste delectus tempore?
                </li>
                <li>Quae atque cum soluta ea facilis aliquid aperiam odit a delectus pariatur eum ut nihil earum animi quis quia possimus nisi culpa, ad unde similique officiis harum illo deleniti ratione!
                </li>
            </ul>
        </div>
    )
}



class App extends React.Component {
    constructor() {
        super();
    }

    render () {
        return (
            <div>
                <div id="gameWrapper">
                </div>
                <Bottle />
            </div>
        )
    }
}



ReactDOM.render(<App/> , document.getElementById('master'))

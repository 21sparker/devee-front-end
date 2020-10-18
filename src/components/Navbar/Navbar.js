import React, {Component} from 'react';
import './Navbar.css';

export default class Navbar extends Component {

    handleClick = event => {
        const item = event.target.innerText;
        this.props.changeCurrentGrouping(item.toLowerCase());
    }

    render() {
        return (

            <nav className="navbar-container">
                <ul className="navbar-items">
                    <li onClick={this.handleClick}>
                        Status
                    </li>
                    <li onClick={this.handleClick}>
                        Bucket
                    </li>
                </ul>
            </nav>
        )
    }
}
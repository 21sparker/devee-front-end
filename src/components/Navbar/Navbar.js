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
                <h3 className="navbar-header">{this.props.project}</h3>
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
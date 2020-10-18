import React, {Component} from 'react';
import './Navbar.css';

export default class Navbar extends Component {
    render() {
        return (

            <nav className="navbar-container">
                <ul className="navbar-items">
                    <li>
                        Status
                    </li>
                    <li>
                        Bucket
                    </li>
                </ul>
            </nav>
        )
    }
}
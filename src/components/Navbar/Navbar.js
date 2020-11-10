import React, {Component} from 'react';
import './Navbar.css';

export default class Navbar extends Component {

    handleClick = event => {
        const item = event.target.innerText;
        this.props.changeCurrentGrouping(item.toLowerCase());
    }

    render() {
        const selectedItemStyle = {
            borderBottom: "2px solid black"
        }

        return (
            <nav className="navbar-container">
                <h3 className="navbar-header">{this.props.project}</h3>
                <ul className="navbar-items">
                    <li onClick={this.handleClick} 
                        style={this.props.currentGrouping === 'status' ? selectedItemStyle : null}>
                        Status
                    </li>
                    <li onClick={this.handleClick}
                        style={this.props.currentGrouping === 'bucket' ? selectedItemStyle : null}>
                        Bucket
                    </li>
                </ul>
            </nav>
        )
    }
}
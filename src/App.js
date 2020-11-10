import React, {Component} from 'react';
import './App.css';
import KanbanBoard from './components/KanbanBoard/KanbanBoard';
import Navbar from './components/Navbar/Navbar';


export default class App extends Component {
    state = {
        currentGrouping: "status",
        currentProject: "Devee",
    }

    changeCurrentGrouping = grouping => {
        this.setState({ currentGrouping: grouping });
    }

    render() {
        return (
            <div className="app-container">
                <Navbar 
                    changeCurrentGrouping={this.changeCurrentGrouping}
                    currentGrouping={this.state.currentGrouping}
                    project={this.state.currentProject} />
                <KanbanBoard currentGrouping={this.state.currentGrouping}/>
            </div>
        );
    }
}
import React from "react";
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom";
import "./App.css";
import {SurveyPage} from "./Survey";
import {LandingPage} from "./Landing";
import "bootstrap/dist/css/bootstrap.css";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: "",
            is_selected: false
        };
    }

    selected(id) {
        this.setState({"selected": id, 'is_selected': true});
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="/">
                                Survey
                            </a>
                        </div>
                    </div>
                </nav>
                {this.state.is_selected ? <SurveyPage id={this.state.selected}/> :
                    <LandingPage selected={this.selected.bind(this)}/>}
            </div>
        );
    }
}

export default App;
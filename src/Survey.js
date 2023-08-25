import React from "react";

import 'survey-core/defaultV2.min.css';
import {Model} from 'survey-core';
import {Survey} from 'survey-react-ui';

class SurveyPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            model: {},
            loading: true
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.onValueChanged = this.onValueChanged.bind(this);
    }

    onValueChanged(result) {
        console.log("value changed!");
    }

    onComplete(result) {
        console.log("Complete! " + JSON.stringify(result.data));
        fetch(window.location.origin + "/result", {
            method: 'POST',
            body: JSON.stringify({'user_response': result.data, 'content': this.state.model}),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        })
            .catch(e => {
                console.log(e);
            })
    }

    componentDidMount() {
        fetch(window.location.origin + "/get_survey?id=" + this.props.id)
            .then(response => response.json())
            .then(data => this.setState({
                model: data,
                loading: false
            }))
    }


    render() {
        return (
            <div className="container">
                <h2>human evaluation</h2>
                {this.state.loading ? (
                        <div className="loading">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) :
                    <Survey
                        model={new Model(this.state.model)}
                        onComplete={this.onComplete}
                        onValueChanged={this.onValueChanged}
                    />
                }
            </div>
        );
    }
}

export {SurveyPage}


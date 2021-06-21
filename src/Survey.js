import React from "react";
import * as Survey from "survey-react";
import * as widgets from "surveyjs-widgets";
import "survey-react/survey.css";
import './index.css';

import "jquery-ui/themes/base/all.css";
import "nouislider/distribute/nouislider.css";
import "select2/dist/css/select2.css";
import "bootstrap-slider/dist/css/bootstrap-slider.css";

import "jquery-bar-rating/dist/themes/css-stars.css";

import $ from "jquery";
import "jquery-ui/ui/widgets/datepicker.js";
import "select2/dist/js/select2.js";
import "jquery-bar-rating";

import "pretty-checkbox/dist/pretty-checkbox.css";
import {LandingPage} from "./Landing";

window["$"] = window["jQuery"] = $;

Survey.StylesManager.applyTheme("default");
widgets.prettycheckbox(Survey);
widgets.select2(Survey, $);
widgets.inputmask(Survey);
widgets.jquerybarrating(Survey, $);
widgets.jqueryuidatepicker(Survey, $);
widgets.nouislider(Survey);
widgets.select2tagbox(Survey, $);
widgets.sortablejs(Survey);
widgets.ckeditor(Survey);
widgets.autocomplete(Survey, $);
widgets.bootstrapslider(Survey);


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
            body: JSON.stringify(result.data),
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
                    <Survey.Survey
                        model={new Survey.Model(this.state.model)}
                        onComplete={this.onComplete}
                        onValueChanged={this.onValueChanged}
                    />}
            </div>
        );
    }
}

export {SurveyPage}


import React from 'react'
import Select from 'react-select'
import './index.css';

class LandingPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            options: [],
            loading: false
        }
        this.componentDidMount = this.componentDidMount.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    selected(id) {
        this.props.selected(id)
    }

    componentDidMount() {
        this.setState({isLoading: true});
        fetch(window.location.origin + "/get_survey_list")
            .then(response => response.json())
            .then(data => {
                let options = data.sort((a, b) => a.value - b.value);
                this.setState({
                    options: options
                }, () => {
                    this.setState({
                        loading: false
                    })
                })
            })
    }

    handleChange = (selectedOption) => {
        this.setState({selectedOption}, () =>
            this.selected(this.state.selectedOption.value)
        );
    };

    render() {
        const {selectedOption} = this.state;

        return (
            <div className="container">
                {this.state.loading ? (
                        <div className="loading">
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    ) :
                    <div>
                        <Select
                            value={selectedOption}
                            onChange={this.handleChange}
                            options={this.state.options}
                        />
                        <br></br>
                        <p>Or</p>
                        <button className="btn btn-primary"
                                onClick={() => this.selected(Math.floor(Math.random() * this.state.options.length) + 1)}>
                            Random Pick a Survey
                        </button>
                    </div>}
            </div>
        );
    }
}

export {LandingPage}
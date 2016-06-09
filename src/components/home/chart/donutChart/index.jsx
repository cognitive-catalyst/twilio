import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classnames from 'classnames';
import DonutFactory from 'utils/DonutFactory'
import getRandomString from 'utils/randomString';
import './style.scss';

class DonutChart extends Component {
    constructor(props) {
        super(props);
        this.donut = null;
    }

    componentDidMount() {
        let options = {
            data: this.props.data || []
        };
        let d3Div = ReactDOM.findDOMNode(this.refs.donutChartRef);
        this.donut = DonutFactory.create(d3Div.id, options);
        this.donut.setDefaultText();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data && !_.isEqual(this.props.data, nextProps.data)) {
            this.donut.updateData(nextProps.data);
        }
    }

    render() {
        return (
            <div className={classnames('donut-chart', this.props.className)}>
                <div id={this.props.id || getRandomString(10)} ref='donutChartRef'></div>
            </div>
        )
    }
}

DonutChart.propTypes = {
    id: React.PropTypes.string,
    className: React.PropTypes.string,
    data: React.PropTypes.array.isRequired
}

export default DonutChart;

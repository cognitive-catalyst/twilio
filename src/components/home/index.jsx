import React, {Component} from 'react';
import Messages from './messages';
import axios from 'axios';
import Chart from './chart';
import Pagination from 'img/pagination.svg';

import './style.scss'

export default class Home extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            numMessages: '...',
            data: [
                {
                    label: 'Positive',
                    value: 33,
                    color: '#4A90E2'
                }, {
                    label: 'Neutral',
                    value: 33,
                    color: '#C7C7C6'
                }, {
                    label: 'Negative',
                    value: 33,
                    color: '#734199'
                }
            ]
        }
    }

    componentDidMount() {
        this.getMessagesCount()
    }

    getMessagesCount = () => {
        axios.get('/api/get_num_messages', {}).then((resp) => {
            this.setState({numMessages: resp.data.num_messages})
        })
    }

    render() {
        return (
            <div className='home'>
                <Chart number={this.state.numMessages} data={this.state.data}/>
                <div className='right-col'>
                    <div className='message-type'>
                        <h3 className='message-type-option incoming'>INCOMING</h3>
                        <h3 className='message-type-option completed'>COMPLETED</h3>
                    </div>
                    <Messages onUpdate={this.getMessagesCount}/>
                    <img src={Pagination} className='pagination'/>
                </div>
            </div>
        )
    }
}

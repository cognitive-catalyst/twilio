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
            sentimentCount: []
        }
    }

    componentDidMount() {
        this.getMessagesCount();
        this.getSentimentCount(100);
    }

    getMessagesCount = () => {
        axios.get('/api/get_num_messages', {}).then((resp) => {
            this.setState({numMessages: resp.data.num_messages})
        })
    }

    getSentimentCount = (num_days) => {
        axios.get(`/api/get_sentiment_count/${num_days}`).then(resp => {
            this.setState({sentimentCount: resp.data || []})
        })
    }

    render() {
        return (
            <div className='home'>
                <Chart number={this.state.numMessages} data={this.state.sentimentCount}/>
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

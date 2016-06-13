import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import Messages from './messages';
import Chart from './chart';
import Pagination from 'img/pagination.svg';

import './style.scss'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.socket = io();
        this.socket.on('connect', () => {
            console.log('Socket Connection Established');
        });
        this.socket.on('disconnect', () => {
            console.log('Socket Disconnected');
        });
        this.state = {
            messages: [],
            numMessages: '...',
            sentimentCount: []
        }
    }

    // shouldComponentUpdate(nextProps, nextState){
    //     if (this.state.messages.length === 0){
    //         return true
    //     } else if (this.state.messages[0].time !== nextState.messages[0].time){
    //         this.getMessagesCount();
    //         return true
    //     } else {
    //         return false
    //     }
    // }

    componentWillMount() {
        this.socket.emit('init data');
        this.socket.on('data', (data) => {
            console.log("Socket Data Received");
            this.setState({messages: JSON.parse(data)});
        })
    }

    getSentimentCount = (num_days) => {
        axios.get(`/api/get_sentiment_count/${num_days}`).then(resp => {
            this.setState({sentimentCount: resp.data})
        })

        axios.get(`/api/get_num_messages/${num_days}`).then((resp) => {
            this.setState({numMessages: resp.data.num_messages})
        })
    }

    render() {
        return (
            <div className='home'>
                <Chart onDurationChange={this.getSentimentCount} number={this.state.numMessages} data={this.state.sentimentCount}/>
                <div className='right-col'>
                    <div className='message-type'>
                        <h3 className='message-type-option incoming'>INCOMING</h3>
                        <h3 className='message-type-option completed'>COMPLETED</h3>
                    </div>
                    <Messages data={this.state.messages}/>
                    <img src={Pagination} className='pagination'/>
                </div>
            </div>
        )
    }
}

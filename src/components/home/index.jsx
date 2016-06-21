import React, {Component} from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import classNames from 'classnames';
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
        this.socket.on('incoming data', (data) => {
            if(this.state.renderIncoming) {
                // Update the sentiment count and messages count when there is a new incoming data
                console.log('Incoming Data', this.state.renderIncoming, data);
                this.getSentimentCount(this.state.numDays);
                this.setState({messages: JSON.parse(data)});
                this.forceUpdate();
            }
        })
        this.socket.on('archived data', (data) => {
            if(!this.state.renderIncoming) {
                console.log('Archived Data', this.state.renderIncoming, data);
                this.setState({messages: JSON.parse(data)});
                this.forceUpdate();
            }
        })
        this.state = {
            messages: [],
            numMessages: '...',
            sentimentCount: [],
            renderIncoming: true
        }
    }

    handleIncomingMessageHeaderClick = () => {
        this.setState({renderIncoming: true}, () => {
            this.socket.emit('get init incoming data');
        });
    }

    handleArchivedMessageHeaderClick = () => {
        this.setState({renderIncoming: false}, () => {
            this.socket.emit('get init archived data');
        });
    }

    componentWillMount() {
        this.socket.emit('get init incoming data');
    }

    getSentimentCount = (num_days) => {
        this.setState({numDays: num_days});
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
                        <h3 onClick={this.handleIncomingMessageHeaderClick}
                            className={classNames('message-type-option', {'active': this.state.renderIncoming})}>
                            INCOMING
                        </h3>
                        <h3 onClick={this.handleArchivedMessageHeaderClick}
                            className={classNames('message-type-option', {'active': !this.state.renderIncoming})}>
                            ARCHIVED
                        </h3>
                    </div>
                    <Messages data={this.state.messages}/>
                    <img src={Pagination} className='pagination'/>
                </div>
            </div>
        )
    }
}

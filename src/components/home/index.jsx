import React, { Component } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import classNames from 'classnames';
import Messages from './messages';
import Chart from './chart';
import Pagination from './pagination';

import './style.scss';

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
            if (this.state.renderIncoming) {
                console.log('Socket Data Incoming');
        // Update the sentiment count and messages count when there is a new incoming data
                this.getSentimentCount(this.state.numDays);
                const jsonData = JSON.parse(data);
                if (this.getPageNumber() === 1) {
                    this.setState({
                        messages: jsonData.messages,
                        totalPages: jsonData.totalPages,
                    });
                }
            }
        });
        this.socket.on('archived data', (data) => {
            if (!this.state.renderIncoming) {
                const jsonData = JSON.parse(data);
                if (this.getPageNumber() === 1) {
                    this.setState({
                        messages: jsonData.messages,
                        totalPages: jsonData.totalPages,
                    });
                }
            }
        });
        this.state = {
            messages: [],
            numMessages: '...',
            sentimentCount: [],
            renderIncoming: true,
            totalPages: 1,
        };
    }

    componentDidMount() {
        // this.socket.emit('get init incoming data', this.getPageNumber());
        this.getSetMessages();
    }

    onArchive(messageId) {
        axios.post(`/api/archive_message/${messageId}`);
    }

    getSetMessages() {
        axios.get(`/api/get_messages/${this.getPageNumber()}`).then(resp => {
            this.setState({
                messages: resp.data.messages,
                totalPages: resp.data.totalPages,
            });
        });
    }

    getSetArchivedMessages() {
        axios.get(`/api/get_archived_messages/${this.getPageNumber()}`).then(resp => {
            this.setState({
                messages: resp.data.messages,
                totalPages: resp.data.totalPages,
            });
        });
    }

    componentDidUpdate(pastProps) {
        if (pastProps.params.pageNumber !== this.props.params.pageNumber) {
            if (this.state.renderIncoming) {
                this.getSetMessages();
                // this.socket.emit('get init incoming data', this.getPageNumber());
            } else {
                this.getSetArchivedMessages();
                // this.socket.emit('get init archived data', this.getPageNumber());
            }
        }
    }

    getPageNumber = () => {
        let currentPage = parseInt(this.props.params.pageNumber, 10);

        if (!Number.isInteger(currentPage) || currentPage <= 0) {
            currentPage = 1;
        }

        return currentPage;
    }

    getSentimentCount = (numDays) => {
        this.setState({
            numDays,
        });
        axios.get(`/api/get_sentiment_count/${numDays}`).then(resp => {
            this.setState({
                sentimentCount: resp.data,
            });
        });

        axios.get(`/api/get_num_messages/${numDays}`).then((resp) => {
            this.setState({
                numMessages: resp.data.num_messages,
            });
        });
    }


    handleArchivedMessageHeaderClick = () => {
        // this.setState({ renderIncoming: false }, () => {
        //     this.socket.emit('get init archived data');
        // });
        this.context.router.push('/');
        this.setState({ renderIncoming: false }, () => {
            this.getSetArchivedMessages();
        });
    }

    handleIncomingMessageHeaderClick =() => {
        this.setState({ renderIncoming: true }, () => {
            this.getSetMessages();
            // this.socket.emit('get init incoming data');
        });
        this.context.router.push('/');

    }
    render() {
        const currentPage = this.getPageNumber();

        return (
            <div className="home">
                <Chart onDurationChange={this.getSentimentCount} number={this.state.numMessages} data={this.state.sentimentCount} />
                <div className="right-col">
                    <div className="message-type">
                        <h3
                          onClick={this.handleIncomingMessageHeaderClick}
                          className={classNames('message-type-option', {
                              active: this.state.renderIncoming,
                          })}
                        >
                            INCOMING
                        </h3>
                        <h3
                          onClick={this.handleArchivedMessageHeaderClick}
                          className={classNames('message-type-option', {
                              active: !this.state.renderIncoming,
                          })}
                        >
                            ARCHIVED
                        </h3>
                    </div>
                    <Messages loading={this.state.loading} data={this.state.messages} onArchive={this.onArchive} />
                    <Pagination
                      currentPage={currentPage}
                      totalPages={this.state.totalPages}
                      goToPage={(n) => {
                          this.setState({
                              loading: true,
                          });
                          this.context.router.push(n.toString());
                      }}
                    />
                </div>
            </div>
      );
    }
}

Home.contextTypes = {
    router: React.PropTypes.func.isRequired,
};
Home.propTypes = {
    params: React.PropTypes.Object,
};

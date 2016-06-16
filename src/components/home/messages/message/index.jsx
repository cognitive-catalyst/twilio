import React from 'react';
import classNames from 'classnames';
import MessageHeader from './messageHeader';
import './style.scss';
import {Sentiment, Route, Entities, Concepts} from './messageInfo';
import Check from 'img/check.svg';
import CheckDone from 'img/check-done.svg';


export default class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            imgSrc: Check
        }
    }

    handleOnClick = () => {
        this.setState({imgSrc: CheckDone});
    }

    render() {
        const {id, text, phoneNumber, city, state, day, time, keywords, concepts, entities, sentiment, archived_day, archived_time} = this.props;
        return (
            <div className='message'>
                <div className = 'message-left'>
                    <MessageHeader
                        phoneNumber={phoneNumber}
                        city={city}
                        state={state}
                        day={day}
                        time={time}
                        archived_day={archived_day}
                        archived_time={archived_time}
                    />
                    <MessageBody text={text} keywords={keywords}/>
                </div>
                <div className = 'message-right'>
                    <Sentiment sentiment={sentiment}/>
                    <Route keywords={keywords}/>
                    <Entities entities={entities}/>
                    <Concepts concepts={concepts}/>
                </div>
                <img src={this.state.imgSrc} onClick={this.handleOnClick} className={classNames('check', {'invisible': archived_day})}></img>
            </div>
        )
    }
}

class MessageBody extends React.Component {

    render(){
        let text = this.props.text;


        if (this.props.keywords != {}){
            let topRel = 0;
            let topKeyword = '';
            for (let k in this.props.keywords){

                if (this.props.keywords[k].relevance > topRel){
                    topRel = this.props.keywords[k].relevance
                    topKeyword = k
                }
            }
            for (let k in this.props.keywords){
                if (k == topKeyword){
                    text = text.replace(k, "<span class='keyword bold'>" + k + "</span>")
                } else {
                    text = text.replace(k, "<span class='keyword'>" + k + "</span>")
                }
            }

        }

        return (
            <h3 className='message-body' dangerouslySetInnerHTML={{__html:text}} />
        )

    }

}

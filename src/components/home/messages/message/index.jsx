import React from 'react';
import MessageHeader from './messageHeader';
import './style.scss';
import {Sentiment, Keywords, Entities, Concepts} from './messageInfo';
import Check from 'img/check.svg';
import CheckDone from 'img/check-done.svg';


export default ({text, phoneNumber, city, state, day, time, keywords, concepts, entities, sentiment}) => (
    <div className='message'>
        <div className = 'message-left'>
            <MessageHeader
                phoneNumber={phoneNumber}
                city={city}
                state={state}
                day={day}
                time={time}
            />
            <h3 className='message-body'>{text}</h3>
        </div>
        <div className = 'message-right'>
            <Sentiment sentiment={sentiment}/>
            <Keywords keywords={keywords}/>
            <Entities entities={entities}/>
            <Concepts concepts={concepts}/>
        </div>
        <img src={Check}></img>
    </div>
)

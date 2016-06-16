import React from 'react';
import Message from './message';

export default ({data}) => {
    const messages = data.map((m, i) => {
        return (
            <Message
                key={i}
                id={m.id}
                text={m.text}
                phoneNumber={m.phone_number}
                city={m.city}
                state={m.state}
                day={m.day}
                time={m.time}
                archived_day={m.archived_day}
                archived_time={m.archived_time}
                keywords={m.keyword}
                entities={m.entity}
                concepts={m.concept}
                sentiment={m.sentiment}
            />
        )
    })
    return(
        <div className='messages'>
            {messages}
        </div>
    )
}

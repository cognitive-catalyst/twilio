import React from 'react';
import Message from './message';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './style.scss';

export default ({ data, onArchive }) => {
    const messages = data.map((m) => {
        return (
      <Message
        key={m.id}
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
        onArchive={onArchive}
      />
      );
    });
    return (
    <ReactCSSTransitionGroup transitionName="switch" transitionAppear>
            {messages}
        </ReactCSSTransitionGroup>
    );
};

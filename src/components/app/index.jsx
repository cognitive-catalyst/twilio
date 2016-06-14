import React, { Component } from 'react';
import avatar from 'img/watson-avatar.svg';
import './style.scss'

export default ({children}) => (
    <div className='app'>
        {/*<a className='banner' href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/question-answer.html" target="_blank">Watson Demo</a>*/}
        <div className='header'>
            <h2 className='header-text'>Watson Services on Twilio Marketplace Demo</h2>
            <img src={avatar} className='avatar' />
        </div>
        {children}
    </div>
)

import React, { Component } from 'react';
import header from 'img/nav-header.svg';
import './style.scss'

export default ({children}) => (
    <div className='app'>
        {/*<a className='banner' href="http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/question-answer.html" target="_blank">Watson Demo</a>*/}
        <img src={header} className='header'/>
        {children}
    </div>
)

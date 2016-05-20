import React, { Component } from 'react';
import header from 'img/nav-header.svg';
import './style.scss'

export default ({children}) => (
    <div className='app'>
        <img src={header} className='header'/>
        {children}
    </div>
)

import React, { Component } from 'react';
import Messages from './messages';
import Axios from 'axios';
import Chart from 'img/chart.svg';
import Pagination from 'img/pagination.svg';

import './style.scss'

export default () => (
    <div className='home'>
        <img src={Chart} className='chart'/>
        <div className='right-col'>
            <div className='message-type'>
                <h3 className='message-type-option incoming'>INCOMING</h3>
                <h3 className='message-type-option completed'>COMPLETED</h3>
            </div>
            <Messages />
            <img src={Pagination} className='pagination'/>
        </div>
    </div>
)

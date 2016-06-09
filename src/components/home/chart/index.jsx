import React from 'react';
import DonutChart from './donutChart';
import './style.scss';

export default({number, data}) => (
    <div className='chart'>
        <h3 className='sentiment-score'>Sentiment Score</h3>
        <div className='time-row'>
            <h4 className='time'>
                24 Hours
                <span className='arrow'>▾</span>
            </h4>
        </div>
        <DonutChart className='circle' data={data}/>
        <h3 className='number'>{number}</h3>
        <h5>total</h5>
    </div>
)

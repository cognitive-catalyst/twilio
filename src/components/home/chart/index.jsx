import React from 'react';
import CircleChart from 'img/circle-chart.svg';
import DownTriangle from 'img/down-triangle.svg';
import './style.scss';
export default ({number}) => (
    <div className='chart'>
        <h3 className='sentiment-score'>Sentiment Score</h3>
        <div className='time-row'>
            <h4 className='time'>
                24 Hours <span className='arrow'>▾</span>
            </h4>
        </div>
        <img className='circle' src={CircleChart} />
        <h3 className='number'>{number}</h3>
        <h5>total</h5>
    </div>
)

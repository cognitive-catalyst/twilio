import React from 'react'

export default ({phoneNumber, city, state, day, time}) => (
    <div className='message-header'>
        <h3 className='info phone-number'>{phoneNumber}</h3>
        <h3 className='info location'>{city.toLowerCase() + ', ' + state}</h3>
        <h3 className='info day'>{day}</h3>
        <h3 className='info time'>{time}</h3>
    </div>
)

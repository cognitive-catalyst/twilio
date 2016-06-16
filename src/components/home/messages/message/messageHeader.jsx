import React from 'react'
import classNames from 'classnames';
import formatPhoneNumber from 'utils/formatPhoneNumber'

export default ({phoneNumber, city, state, day, time, archived_day, archived_time}) => (
    <div>
        <div className='message-header'>
            <h3 className='info phone-number'>{formatPhoneNumber(phoneNumber)}</h3>
            <h3 className='info location'>{city.toLowerCase() + ', ' + state}</h3>
            <h3 className='info day'>{day}</h3>
            <h3 className='info time'>{time}</h3>
        </div>
        <div className={classNames('message-header', {'hidden': !archived_day})}>
            <h3 className='info'>Archived: {archived_day} {archived_time}</h3>
        </div>
    </div>
)

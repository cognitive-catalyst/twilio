import React from 'react';

const Sentiment = ({sentiment}) => {
    // if (sentiment >=
    return (
        <div className={'sentiment message-info ' + sentiment}>
            <h4 className='key'>Sentiment: </h4>
            <h4 className='value'>{sentiment}</h4>
        </div>
    )
}

const Route = ({keywords}) => {

    const luggage = ['bag', 'bags','baggage', 'luggage']
    const customer_service = ['flight crew', 'flight attendant', 'stewardess', 'customer service', 'stewardesses', 'flight attendants',]
    const weather_delay = ['weather delay', 'weather', 'weather delays']

    let valString = '';
    let topRel = 0
    if (keywords != {} ){
        for (let k in keywords){
            let relevance = keywords[k]['relevance']
            if (luggage.indexOf(k.toLowerCase()) != -1 &&  relevance > topRel){
                valString = 'Luggage'
                topRel = relevance
            } else if (customer_service.indexOf(k.toLowerCase()) != -1 &&  relevance > topRel){

                valString ='Customer Service'
                topRel = relevance
            } else if (weather_delay.indexOf(k.toLowerCase()) != -1 &&  relevance > topRel){
                valString ='Weather Delay'
                topRel = relevance
            }
        }
    }
    return (
        <div className='route message-info' style={valString=='' ? {display:'none'}:{}}>
            <h4 className='key'>Route: </h4>
            <h4 className='value'>{valString}</h4>
        </div>
    )
}

const Entities = ({entities}) => {
    let valString = '';
    if (entities != {} ){
        valString = Object.keys(entities).join(', ')
    }

    return (
        <div className='entities message-info' style={valString=='' ? {display:'none'}:{}}>
            <h4 className='key'>Entities: </h4>
            <h4 className='value'>{valString}</h4>
        </div>
    )
}

const Concepts = ({concepts}) => {
    let valString = '';
    if (concepts != {} ){
        valString = Object.keys(concepts).join(', ')
    }

    return (
        <div className='concepts message-info' style={valString=='' ? {display:'none'}:{}}>
            <h4 className='key'>Concepts: </h4>
            <h4 className='value'>{valString}</h4>
        </div>
    )
}

module.exports = {
    Sentiment,
    Route,
    Entities,
    Concepts
}

import React from 'react';

const Sentiment = ({sentiment}) => {
    // if (sentiment >=
    return (
        <div className={'sentiment message-info ' + sentiment}>
            <h4 className='key'>Sentiment: </h4>
            <h4 className='value '>{sentiment}</h4>
        </div>
    )
}

const Keywords = ({keywords}) => {

    let valString = '';
    if (keywords != {} ){
        valString = Object.keys(keywords).join(', ')
    }

    return (
        <div className='keywords message-info' style={valString=='' ? {display:'none'}:{}}>
            <h4 className='key'>Keywords: </h4>
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
    Keywords,
    Entities,
    Concepts
}

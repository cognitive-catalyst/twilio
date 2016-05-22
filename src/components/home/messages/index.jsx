import React from 'react';
import Message from './message';
import axios from 'axios';


export default class Messages extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            messages: []
        }
    }

    componentWillMount(){
        this.getMessages()
        setInterval(this.getMessages, 2000)
    }

    getMessages = () => {
        axios.get('/api/get_messages', {})
            .then( (resp) => {
                this.setState({
                    messages: resp.data
                })
            })
    }

    shouldComponentUpdate(nextProps, nextState){

        if (this.state.messages.length === 0){
            return true
        } else if (this.state.messages[0].time !== nextState.messages[0].time){
            this.props.onUpdate()
            return true
        } else {
            return false
        }
    }

    render(){
        const messages = this.state.messages.map( (m) => {
            return (
                <Message
                    text={m.text}
                    phoneNumber={m.phone_number}
                    city={m.city}
                    state={m.state}
                    day={m.day}
                    time={m.time}
                    keywords={m.keyword}
                    entities={m.entity}
                    concepts={m.concept}
                    sentiment={m.sentiment}
                />
            )
        })
        return(
            <div className='messages'>
                {messages}
            </div>
        )
    }

}

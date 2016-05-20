import React from 'react';
import Message from './message';
import Axios from 'axios';


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
        Axios.get('/api/get_messages', {})
            .then( (resp) => {
                this.setState({
                    messages: resp.data
                })
            })
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

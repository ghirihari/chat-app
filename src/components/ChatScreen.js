import React from 'react';
import logo from './assets/pew.jpg'; 
import { Redirect } from "react-router-dom";
import firebase from '../config/firebase'
import '../App.css';

class ChatScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message:null,
            messages:[],
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    messageTyped = (event) => {
        this.setState({message: event.target.value});
      }
  
    sendMessage = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/send?from"+this.props.userid+"&to="+this.props.name.id+"&message="+this.state.message)
        .then(response => response.json())
        .then(data => {
            if(data.status==200){
                this.setState({message:''})
            }
            else if(data.status==404){
                console.error(data)
            }
        });
    }
// https://garnet-gregarious-robe.glitch.me/send?from=fzRZGtEdBzX3OhMHLPUine1MBqF2&to=NdISa7ViaqM4noZ0ZdLo2IbEGK53&message=How%20are%20you
    ren = () => {
        this.chats = firebase.database().ref('users/' + this.props.userid + '/messages/'+ this.props.name.id);
        var message_set = [];

        this.chats.on('child_added', (snapshot) => {
            var messageList = snapshot.val();
            var time = new Date(messageList.time).toLocaleTimeString();
            var message = {
                sender:messageList.from,
                time:time,
                message:messageList.text
            }
            
            message_set.concat(message)
            this.setState({messages:this.state.messages.concat(message)})
        });
        // this.scrollToBottom();          
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.name.id !== this.props.name.id) {
            this.chats.off()
            this.setState({messages:[]},()=>{this.ren()})
        }
        this.scrollToBottom();
    }
    
    
    componentDidMount = () => {
        this.ren()
    }

    render(){
            return(
                <div className="chat-col">
                    {/* Chat Title */}
                    <div className="chat-title shadow" style={{display:'flex', alignItems:'center'}}>
                        <div className="chatDP_frame">
                            <img className="chatDP"src={this.props.name.displayPicture} />
                        </div>
                        <div style={{alignSelf: 'center', paddingLeft:'10px', flexGrow:'1'}}>
                            <h5 className="recepient_name" style={{marginBottom:'0px'}}>{this.props.name.displayName}</h5>
                            <label style={{fontSize:'smaller',marginBottom:'0px'}}>Online</label>
                        </div>
                        {/* <div style={{alignSelf: 'center', padding:'20px'}}>
                            <div class="btn-group dropleft">
                                <button type="button" class="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg id="fi_2089793" enable-background="new 0 0 515.555 515.555" height="15" viewBox="0 0 515.555 515.555" width="15" xmlns="http://www.w3.org/2000/svg"><path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"></path><path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"></path><path d="m303.347 355.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"></path></svg>
                                </button>
                                <div class="dropdown-menu">
                                    <a class="dropdown-item" href="#">Clear Chats</a>
                                    <a class="dropdown-item" href="#">Delete Contact</a>
                                </div>
                            </div>
                        </div> */}
                    </div>   
                    {/* Messages */}
                    <div className="chat-messages">
                        {this.state.messages.map((item,index) => {
                        var type = (item.sender!==this.props.userid)?"left":"right-bubble"
                            return(
                            <div className={type} key={index}>
                                <div>
                                    <div key={index}>
                                    <label className="bubble-message-name">{item.time}</label>
                                        <div className="bubble sender shadow">
                                            <label className="bubble-message">{item.message}</label>
                                        </div>
                                    </div> 
                                </div>
                            </div>
                            )
                        })}
                        <div style={{ float:"left", clear: "both" }}
                            ref={(el) => { this.messagesEnd = el; }}>
                        </div>
                    </div>
                    <div>
                    <div className="input-group message-input">
                        <input type="text" className="form-control" style={{height:'50px'}} placeholder="Enter Message" value={this.state.message} onChange={this.messageTyped}/>
                        <div className="input-group-append">
                            <button className="btn btn-white"  type="button" onClick={this.addImage}>
                                <svg fill="black" height={35} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                    >
                                    <path d="M12.76 19.94A5.49 5.49 0 015 12.18l8.76-8.75a3.72 3.72 0 016.34 2.63A3.68 3.68 0 0119 8.68L10.67 17a1.36 1.36 0 01-1.92-1.9l8.34-8.34-1.42-1.41-8.34 8.34a3.36 3.36 0 004.75 4.75l8.35-8.34A5.72 5.72 0 0012.34 2l-8.76 8.77a7.49 7.49 0 0010.59 10.59l7.92-7.93L20.68 12z" />
                                </svg>
                            </button>
                        </div>

                        <div className="input-group-append">
                            <button className="btn btn-white"  type="button" onClick={this.sendMessage}>
                                <svg fill="black" height={35} viewBox="0 0 24 24" width={35} xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.75 17.612v4.638a.751.751 0 001.354.444l2.713-3.692zM23.685.139a.75.75 0 00-.782-.054l-22.5 11.75a.752.752 0 00.104 1.375l6.255 2.138 13.321-11.39L9.775 16.377l10.483 3.583a.753.753 0 00.984-.599l2.75-18.5a.751.751 0 00-.307-.722z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    </div>
                </div>
            )
    }
}

export default ChatScreen;

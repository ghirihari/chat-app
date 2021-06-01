import React from 'react';
// import logo from './assets/pew.jpg'; 
// import { Redirect } from "react-router-dom";
import firebase from '../config/firebase'
import '../App.css';
import tone from './assets/Tone.mp3'
class ChatScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message:'',
            messages:[],
            sent:false
        }
    }

    scrollToBottom = () => {
        this.messagesEnd.scrollIntoView({ behavior: "smooth" });
      }

    messageTyped = (event) => {
        this.setState({message: event.target.value});
      }
  
    sendMessage = () => {
        this.setState({sent:true})
        fetch("https://garnet-gregarious-robe.glitch.me/send?from="+this.props.userid+"&to="+this.props.name.id+"&message="+this.state.message)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                this.setState({message:''})
            }
            else if(data.status===404){
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
        this.scrollToBottom();          
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevProps.data != this.props.data)
        {
            console.log('sent',this.state.sent)
            if(this.state.sent==true)
            {
                this.setState({sent:false})
            }else{
                this.audioEl.play();
            }
        }
        this.scrollToBottom();
    }
    
    
    componentDidMount = () => {
        this.audioEl = document.getElementById('tone')
    }

    render(){

            return(
                <div className="chat-col">
                    <audio id="tone" className="audio-element">
                            <source src={tone}></source>
                    </audio>
                    {/* Chat Title */}
                    <div className="chat-title shadow" style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                        <div onClick={()=>this.props.unSetRec()}>
                            <svg className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492" >
                                <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z" />
                            </svg>
                        </div>

                        <div className="chatDP_frame">
                            <img alt="DP" className="chatDP"src={this.props.name.displayPicture} />
                        </div>
                        <div style={{display:'block',alignSelf: 'center', paddingLeft:'10px', flexGrow:'1'}}>
                            <h5 className="recepient_name" style={{marginBottom:'0px'}}>{this.props.name.displayName}</h5>
                        </div>

                        {/* <div style={{alignSelf: 'center', padding:'20px'}}>
                            <div className="btn-group dropleft">
                                <button type="button" className="btn" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg id="fi_2089793" enable-background="new 0 0 515.555 515.555" height="15" viewBox="0 0 515.555 515.555" width="15" xmlns="http://www.w3.org/2000/svg"><path d="m303.347 18.875c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"></path><path d="m303.347 212.209c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"></path><path d="m303.347 355.541c25.167 25.167 25.167 65.971 0 91.138s-65.971 25.167-91.138 0-25.167-65.971 0-91.138c25.166-25.167 65.97-25.167 91.138 0"></path></svg>
                                </button>
                                <div className="dropdown-menu">
                                    <a className="dropdown-item" href="#">Clear Chats</a>
                                    <a className="dropdown-item" href="#">Delete Contact</a>
                                </div>
                            </div>
                        </div> */}
                    </div>   
                    {/* Messages */}
                    
                    <div className="chat-messages">
                        {Object.entries(this.props.data[this.props.name.id]).map((item,index) => {
                            let data = item[1]
                            let time = new Date(data.time).toLocaleTimeString();

                            var type = (data.from!==this.props.userid)?"left":"right-bubble"
                                return(
                                <div className={type} key={index}>
                                    <div>
                                        <div key={index}>
                                        <label className="bubble-message-name">{time}</label>
                                            <div className="bubble sender shadow">
                                                <label className="bubble-message">{data.text}</label>
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
                        {/* {this.state.attachment &&
                            <div className="attach-icons">
                                <button className="btn attach-btn btn-light">
                                    <svg height={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M446.575 0H65.425C29.349 0 0 29.35 0 65.426v381.149C0 482.65 29.349 512 65.425 512h381.15C482.651 512 512 482.65 512 446.574V65.426C512 29.35 482.651 0 446.575 0zm35.267 446.575c0 19.447-15.821 35.267-35.267 35.267H65.425c-19.447 0-35.268-15.821-35.268-35.267v-55.007l99.255-84.451a9.745 9.745 0 0112.562-.075l62.174 51.628c5.995 4.977 14.795 4.569 20.304-.946L372.181 209.77c2.67-2.675 5.783-2.935 7.408-2.852 1.62.083 4.695.661 7.078 3.596l95.176 117.19v118.871zm0-166.71l-71.766-88.366a39.98 39.98 0 00-28.942-14.701c-11.268-.57-22.317 3.672-30.294 11.662L212.832 326.681l-51.59-42.839a39.85 39.85 0 00-51.373.308l-79.712 67.822V65.426c0-19.447 15.821-35.268 35.268-35.268h381.15c19.447 0 35.267 15.821 35.267 35.268v214.439z" />
                                        <path d="M161.174 62.995c-40.095 0-72.713 32.62-72.713 72.713 0 40.094 32.619 72.713 72.713 72.713s72.713-32.619 72.713-72.713-32.618-72.713-72.713-72.713zm0 115.269c-23.466 0-42.556-19.091-42.556-42.556 0-23.466 19.09-42.556 42.556-42.556 23.466 0 42.556 19.091 42.556 42.556s-19.09 42.556-42.556 42.556z" />
                                    </svg>
                                </button>
                                <button className="btn attach-btn btn-light">
                                    <svg height={30} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                        <path d="M341.476 338.285c54.483-85.493 47.634-74.827 49.204-77.056C410.516 233.251 421 200.322 421 166 421 74.98 347.139 0 256 0 165.158 0 91 74.832 91 166c0 34.3 10.704 68.091 31.19 96.446l48.332 75.84C118.847 346.227 31 369.892 31 422c0 18.995 12.398 46.065 71.462 67.159C143.704 503.888 198.231 512 256 512c108.025 0 225-30.472 225-90 0-52.117-87.744-75.757-139.524-83.715zm-194.227-92.34a15.57 15.57 0 00-.517-.758C129.685 221.735 121 193.941 121 166c0-75.018 60.406-136 135-136 74.439 0 135 61.009 135 136 0 27.986-8.521 54.837-24.646 77.671-1.445 1.906 6.094-9.806-110.354 172.918L147.249 245.945zM256 482c-117.994 0-195-34.683-195-60 0-17.016 39.568-44.995 127.248-55.901l55.102 86.463a14.998 14.998 0 0025.298 0l55.101-86.463C411.431 377.005 451 404.984 451 422c0 25.102-76.313 60-195 60z" />
                                        <path d="M256 91c-41.355 0-75 33.645-75 75s33.645 75 75 75 75-33.645 75-75-33.645-75-75-75zm0 120c-24.813 0-45-20.187-45-45s20.187-45 45-45 45 20.187 45 45-20.187 45-45 45z" />
                                    </svg>
                                </button>
                                <button className="btn attach-btn btn-light">
                                    <svg width={30} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                                        <g fill="none" fillRule="evenodd">
                                            <path d="M-3-3h24v24H-3z" />
                                            <path
                                            d="M16 0H2C.9 0 0 .9 0 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 16H2V2h14v14zM4 7h2v7H4V7zm4-3h2v10H8V4zm4 6h2v4h-2v-4z"
                                            fill="#1D1D1D"
                                            />
                                        </g>
                                    </svg>
                                </button>
                            </div>
                        } */}
                       
                        <div className="input-group message-input">
                            <input type="text" className="form-control" style={{height:'50px'}} placeholder="Enter Message" value={this.state.message} onChange={this.messageTyped}/>
                            {/* <div className="input-group-append">
                                <button className="btn btn-white"  type="button" onClick={()=>this.setState({attachment:!this.state.attachment})}>
                                    <svg fill="black" height={30} data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                                        >
                                        <path d="M12.76 19.94A5.49 5.49 0 015 12.18l8.76-8.75a3.72 3.72 0 016.34 2.63A3.68 3.68 0 0119 8.68L10.67 17a1.36 1.36 0 01-1.92-1.9l8.34-8.34-1.42-1.41-8.34 8.34a3.36 3.36 0 004.75 4.75l8.35-8.34A5.72 5.72 0 0012.34 2l-8.76 8.77a7.49 7.49 0 0010.59 10.59l7.92-7.93L20.68 12z" />
                                    </svg>
                                </button>
                            </div> */}

                            <div className="input-group-append">
                                <button className="btn btn-white"  type="button" onClick={this.sendMessage}>
                                    <svg fill="black" height={30} viewBox="0 0 24 24" width={30} xmlns="http://www.w3.org/2000/svg">
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

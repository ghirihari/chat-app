import React from 'react';
import '../App.css';
// import logo from './assets/pew.jpg'; 
// import plane from './assets/paper-plane.svg'; 

import io from "socket.io-client";
import MessageList from './MessageList'

class Room extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      occupants:[],
      message:null,
      sms:[]
    }
    this.roomid = this.props.match.params.roomid 
    this.userid = this.props.match.params.userid

    }  
    
    componentDidMount = () => {
      this.socket = io('http://localhost:5000');
      this.socket.emit('joinroom',this.userid);
      this.socket.on('occupants', users => {
        console.log(users);
        this.setState({occupants:users})
      });
      this.socket.on('message_received', (message) => {
        console.log(message)
        this.setState({sms:this.state.sms.concat(message)})
      });
    }

    messageTyped = (event) => {
      this.setState({message: event.target.value});
    }

    sendMessage = () => {
      let date = new Date()
      let time = date.getHours()+':'+date.getMinutes();
      this.socket.emit('message',{
                                    sender:this.userid,
                                    time:time,
                                    message:this.state.message});
    }


  render(){
    return (
        <div className="container-fluid">
          <div className="row" style={{height:'100vh'}}>
            <div className="col-3 contacts_col d-none d-lg-block">
              <div>
                {/* <div className="username_div">
                  <h2>
                    <span className="badge badge-secondary">{this.userid[0]}</span>
                    <label className="username">{this.userid}</label>
                  </h2>
                </div> */}
                <MessageList users={this.state.occupants}/>
            </div>
          </div>

            <div className="col-lg-9 col-md-12" style={{padding:'0px'}}>
              <div className="chat-col">
                {/* Chat Title */}
                <div className="chat-title shadow">
                  <div className="chatDP_frame">
                    {/* <img className="chatDP"src={logo} /> */}
                  </div>
                  <div style={{alignSelf: 'center', paddingLeft:'10px'}}>
                    <h5 style={{marginBottom:'0px'}}>{this.roomid}</h5>
                    <label style={{fontSize:'smaller'}}>{this.state.occupants.length} Online</label>
                  </div>
                </div>   
                  <div className="chat-messages">
                    {this.state.sms.map((item,index) => {
                      console.log(item.sender,this.userid)
                      var type = (item.sender!==this.userid)?"left":"right-bubble"
                        return(
                        <div className={type} key={index}>
                          <div>
                            <div key={index}>
                              <label className="bubble-message-name">{item.sender} · {item.time}</label>
                              <div className="bubble sender shadow">
                                <label className="bubble-message">{item.message}</label>
                              </div>
                            </div> 
                          </div>
                        </div>
                        )
                    })}
                </div>
                <div>
                  <div className="input-group message-input">
                    <input type="text" className="form-control" style={{height:'50px'}} placeholder="Enter Message" onChange={this.messageTyped}/>
                    <div className="input-group-append">
                      <button className="btn btn-primary"  type="button" onClick={this.sendMessage}>Send</button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            
          </div>
        </div>
      );
  }
}

export default Room;

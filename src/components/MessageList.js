import React from 'react';
import CryptoJS from 'crypto-js';

// import { Redirect } from "react-router-dom";
import Logo from './assets/pew.jpg'; 

class MessageList extends React.Component {

    constructor(){
        super();
        this.state = {
            selected:null
        }
    }

    b64decode = (data) => {
        var b = new Buffer(data, 'base64')
        var s = b.toString();
        return s;
    }
    
    select = (item) => {
        console.log(item)
        this.setState({selected:item})
        this.props.setRec(item)
    }

    render(){
        return(
            <div className="col-12 messages_list_group">
                {this.props.users.length===0 ? 
                <div style={{textAlign:'center'}}>
                    <h5><span className="badge badge-danger">No Chats Found</span></h5>
                </div>:
                <div className="messages-list">
                    {this.props.users.map((item,index) => {
                        var len = Object.entries(this.props.chatData[item.id]).length;
                        var text = Object.entries(this.props.chatData[item.id])[len-1][1].text;
                        var type = Object.entries(this.props.chatData[item.id])[len-1][1].type;
                        var message_class = "row messages_list_item shadow";

                        if(this.props.recipient===item){
                            message_class+=" gradient-list";
                        }
                        var MessageText = text;

                        if((this.props.private) && type==="chat")
                        {
                            try{
                                var pure = this.b64decode(text)
                                var bytes  = CryptoJS.AES.decrypt(pure, item.sharedKey);
                                var originalText = bytes.toString(CryptoJS.enc.Utf8);
                                MessageText = originalText;   
                            }
                            catch(err){
                                console.log(err);
                            }    
                        }

                        if(text.length>35)
                            text = text.slice(0,35)+'...'

                        console.log(item)
                        let dp = (item.displayPicture)?item.displayPicture:Logo;
                        return(
                            <div id={'message-list-'+item.id} onClick={()=>this.select(item)} className={message_class} key={index}>
                                <div className="col-2" style={{padding:'0px'}}>
                                    <img alt="DP" className="listDP"src={dp} />
                                </div>
                                <div className="col-10" style={{alignSelf:'center'}}>
                                    <div className="row" style={{overflow:'hidden'}}>
                                        <div className="col-12">  
                                            <p className="message-list-name">{item.displayName}</p>
                                        </div>
                                        <div className="col">
                                            <div className="time">
                                                <p style={{marginBottom:'0px'}}>{MessageText}</p>
                                            </div>
                                        </div>
                                    </div>
                                {this.props.type !== 'request' &&
                                    <div className="row">
                                        <div className="col">
                                            <label className="prev_message">Good Morning! Good Morning!</label>
                                        </div>
                                    </div>   
                                }
                            </div>
                        </div>    
                        )
                    })}
                </div>
                }
           </div>
        )
    }
}

export default MessageList;

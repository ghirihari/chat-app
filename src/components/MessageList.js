import React from 'react';
// import { Redirect } from "react-router-dom";
// import logo from './assets/pew.jpg'; 

class MessageList extends React.Component {
    render(){
        return(
            <div className="col-12 messages_list_group">
                {/* <div className="row messages_list_item shadow staff">
                    <div className="col-3" style={{padding:'0px'}}>
                        <div className="listDP_frame">
                            <img alt="DP" className="listDP"src={logo} />
                        </div>
                        </div>
                        <div className="col-9" style={{alignSelf:'center'}}>
                        <div className="row">
                            <div className="col-8">  
                            <h5 style={{marginBottom:'0px'}}>Host</h5>
                            <div className="prev_message">10:45 AM</div>
                            </div>
                            <div className="col-4">
                            <div className="time">
                                <p style={{marginBottom:'0px'}}>12:30AM</p>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>     */}

            <div className="messages-list">
                 {this.props.users.map((item,index) => {
                     var len = Object.entries(this.props.chatData[item.id]).length;
                     var text = Object.entries(this.props.chatData[item.id])[len-1][1].text;
                     if(text.length>35)
                        text = text.slice(0,35)+'...'
                    return(
                        <div id={item.id} onClick={()=>this.props.setRec(item)} className={"row messages_list_item shadow "} key={index}>
                            <div className="col-2" style={{padding:'0px'}}>
                                <img alt="DP" className="listDP"src={item.displayPicture} />
                            </div>
                            <div className="col-10" style={{alignSelf:'center'}}>
                                <div className="row">
                                    <div className="col-12">  
                                        <p className="message-list-name">{item.displayName}</p>
                                    </div>
                                    <div className="col">
                                        <div className="time">
                                            <p style={{marginBottom:'0px'}}>{text}</p>
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
           </div>
        )
    }
}

export default MessageList;

import React from 'react';
// import { Redirect } from "react-router-dom";
// import logo from './assets/pew.jpg'; 

class MessageList extends React.Component {
    render(){
        console.log(this.props.users)
        return(
            <div className="col-12 messages_list_group">
                {this.props.users.length==0 ? 
                <div style={{textAlign:'center'}}>
                    <h5><span class="badge badge-danger">No Chats Found</span></h5>
                    {/* <label className="sub_Heading" style={{margin:'0px 15px'}}>No Chats Found</label>  */}
                </div>:
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
                }
           </div>
        )
    }
}

export default MessageList;

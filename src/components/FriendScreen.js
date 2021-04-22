import React from 'react';
import '../App.css';

function FriendTile(props) {
    var streak = 0;
    var today = new Date();
    var date = new Date(props.id.time);
    var difference_ms = today.getTime() - date.getTime();      
    streak = Math.round(difference_ms/(1000 * 3600 * 24));

    return(
        <div className="row messages_list_item shadow">
            <div className="col-4" style={{padding:'0px'}}>
                <img alt="DP" className="friend-tile"src={props.id.displayPicture} />
            </div>
            <div className="col-8" style={{alignSelf:'center'}}>
            <label className="friends-list-name">{props.id.displayName}</label>
            <label className="" style={{display:'block'}}>{props.id.email}</label>
            <label className="badge badge-pill badge-danger" >{' ♥ '+streak+' Days'}</label>                      
            </div>
        </div>
    );
}

function FriendsList(props){    
    if(props.friends)
    {        
        return(
            <div className="row">
                {props.friends.map((item,index) => {
                    return(
                        <div className="col-6" key={item.id}>
                            <FriendTile id={item}/>
                        </div>
                    )
                })}
            </div>
        )    
    }else{
        return(<>Loading</>)
    }
}

class FriendScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            friends:[],
            length:0
        }
    }
    
    fetchFriends = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/friends?uid="+this.props.uid)
        .then(response => response.json())
        .then(data => {
            this.setState({friends:data,length:data.length})
        })
    }

    componentDidMount = () => {
        this.fetchFriends();
    }

    render(){
        return(
            <div className="chat-col">
                <div className="chat-title shadow" style={{display:'flex', alignItems:'center', padding:'15px'}}>
                    <div>
                        <svg style={{width:'50px'}}xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M155.327 57.142c-51.531 0-93.454 44.45-93.454 99.086 0 54.636 41.923 99.086 93.454 99.086s93.455-44.45 93.455-99.086c0-54.636-41.923-99.086-93.455-99.086zM367.798 71.321l-.636.002c-21.626.179-41.826 9.31-56.878 25.713-14.788 16.113-22.829 37.37-22.644 59.854.186 22.484 8.577 43.605 23.628 59.473 15.17 15.991 35.265 24.773 56.651 24.773l.646-.002c21.626-.179 41.826-9.311 56.878-25.713 14.788-16.113 22.829-37.37 22.644-59.855-.385-46.594-36.34-84.245-80.289-84.245zM371.74 257.358h-7.76c-36.14 0-69.12 13.74-94.02 36.26a180.71 180.71 0 0117.78 15.61c16.58 16.58 29.6 35.9 38.7 57.42 8.2 19.38 12.88 39.8 13.97 60.83H512v-29.87c0-77.33-62.92-140.25-140.26-140.25zM310.35 427.478c-2.83-45.59-25.94-85.69-60.43-111.39-25.09-18.7-56.21-29.77-89.92-29.77h-9.34C67.45 286.319 0 353.768 0 436.978v17.88h310.65v-17.88c0-3.19-.1-6.36-.3-9.5z" />
                        </svg>

                    </div>
                    <div style={{alignSelf: 'center', paddingLeft:'10px', flexGrow:'1'}}>
                        <h5 className="recepient_name" style={{marginBottom:'0px'}}>Friends List</h5>
                        <label style={{fontSize:'smaller',marginBottom:'0px'}}>{this.state.length} Friends</label>
                    </div>
                </div>   

                <div className="col" style={{ overflowY:'scroll'}}>
                    <FriendsList friends={this.state.friends}/>
                </div>
                    
                    {/* <div className="col-2" style={{padding:'0px'}}>
                        <img alt="DP" className="listDP"src={logo} />
                    </div>
                    <div className="col-10" style={{alignSelf:'center'}}>
                        <div className="row">
                            <div className="col-12">  
                                <p className="message-list-name">{'Conor McGregor'}</p>
                            </div>
                            <div className="col-4">
                                <div className="time">
                                    <p style={{marginBottom:'0px'}}>12:30AM</p>
                                </div>
                            </div>
                        </div>
                    </div> */}
            </div>
        )
    }

}

export default FriendScreen;

import React from 'react';
import Posts from './assets/posts.png'

function PostTile(props) {
    var date = new Date(props.time);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    // var time = months[date.getMonth()]+" "+date.getDate()+","+date.getFullYear()
    return(
        <div className="post">
            {/* Posts */}
            {/* <div className="post-image-container"> */}
                <img alt="post" className="post-image" src={props.postURL} />
            {/* </div> */}
            {/* <div className="post-caption">
                <label style={{display:'block',textAlign:'center'}}>{time}</label>
            </div> */}
        </div>
    );
}

class PostScreen extends React.Component {
      render(){
        return(
            <div className="col chat-col" style={{ overflowY:'scroll'}}>
                {!this.props.name &&
                    <div className="chat-col" style={{justifyContent:'center'}}>
                        <div style={{textAlign:'center'}}>
                            <img src={Posts} alt="Illustration" className="illustration"></img>
                            {/* {/* <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Chats</h1> */}
                            {/* <h2 className="capt">Click on a friend to view his posts</h2>  */}
                        </div>
                    </div> 

                }

            {this.props.name &&
                <div className="chat-col" >
                    {/* Title */}
                    <div className="chat-title shadow" style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                        <div onClick={()=>this.props.unSetWall()}>
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
                    </div>   
                    {/* Posts */}
                    {(this.props.wallData&&this.props.wallData!=='None') &&
                        <div className="col chat-messages">
                            <div className="imageGrid">
                                    {Object.entries(this.props.wallData).map((item,index)=>{
                                        return(
                                            <PostTile
                                                key = {item[1].image}
                                                postURL={item[1].image}
                                                time={item[1].time}
                                                name={this.props.wall.displayName}
                                            />
                                        )
                                    })}
                            </div>
                        </div>
                    }
                    {/* No posts */}
                    {this.props.wallData==='None' &&
                        <div className="chat-col" style={{justifyContent:'center'}}>
                            <div style={{textAlign:'center'}}>
                                <h2 className="badge badge-danger" style={{fontSize:'20px',marginTop:'-25px',fontStyle:'italic'}}>No Posts Yet!</h2>
                            </div>
                        </div>                    
                    }
                </div>
            }
            </div>
        )
    }

}

export default PostScreen;

import React from 'react';
// import logo from './assets/pew.jpg'; 

function PostTile(props) {
    var date = new Date(props.time);
    var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var time = months[date.getMonth()]+" "+date.getDate()+","+date.getFullYear()
    return(
        <div className="col post shadow">
            <div className="post-image-container">
                <img alt="DP" className="post-image" src={props.postURL} />
            </div>
            <div className="post-image-text">
                <label style={{display:'block',textAlign:'center'}}>{'@'+props.name}</label>
            </div>
            <div className="post-caption">
                <label style={{display:'block',textAlign:'center'}}>{time}</label>
            </div>
        </div>
    );
}

class PostScreen extends React.Component {
      render(){
        return(
            <div className="col chat-col" style={{ overflowY:'scroll'}}>
                {!this.props.wallData &&
                <div style={{textAlign:'center'}}>
                    <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Posts</h1>
                </div>
                }
                {(this.props.wallData&&this.props.wallData!=='None') &&
                   <div className="row">
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
                }
                {this.props.wallData==='None' &&
                    <div style={{textAlign:'center'}}>
                        <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>No Posts</h1>
                    </div>
                }
                
            </div>
        )
    }

}

export default PostScreen;

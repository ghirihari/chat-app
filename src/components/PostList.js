import React from 'react';
import logo from './assets/pew.jpg'; 
import firebase from '../config/firebase'

class PostList extends React.Component {

    constructor(){
        super()
        this.state = {
            btnState:"Add Post"
        }
    }
    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }


    fileUpload = (e) => {
        this.setState({btnState:'Uploading'})
        let file = e.target.files[0];
        this.getBase64(file, (result) => {
            console.log('base64 Loaded');
            // document.getElementById("UserDP").src = result;
        });
    
        var time = new Date().getTime();
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('posts/'+this.props.user.uid+'/'+time).put(file);
        
        uploadTask.on('state_changed', 
        (snapshot) => {}, 
        (error) => {}, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebase.database().ref('posts/'+this.props.user.uid).push(
                    {
                        image:downloadURL, 
                        time:new Date().getTime()
                    }).then(()=>{
                        console.log('Saved at',downloadURL)
                        this.setState({btnState:'Uploaded'})
                    })
            });
        }
        );
    }

    setMe = () => {
        let item = {
            id:this.props.user.uid,
            displayName:this.props.user.displayName,
            displayPicture:this.props.user.photoURL
        }
        this.props.setWall(item)
    } 

    render(){
        return(
            <div className="col" style={{marginTop:'10px'}}>
                <div>
                    <div style={{textAlign:'center'}}>
                        <div>
                            <input hidden id="icon-button-file" type="file" onChange={this.fileUpload}/>
                            <label htmlFor="icon-button-file" style={{width:'100%'}} className="btn btn-dark">{this.state.btnState}</label>
                        </div>
                        <div id={this.props.user.uid} onClick={()=>{this.setMe()}} className={"row messages_list_item shadow "} key={this.props.user.id}>
                                    <div className="col-2" style={{padding:'0px'}}>
                                        <img alt="DP" className="listDP"src={this.props.user.photoURL} />
                                    </div>
                                    <div className="col" style={{alignSelf:'center'}}>
                                        <div className="row">
                                            <div className="col-12">  
                                                <p className="message-list-name" style={{textAlign:'start'}}>You</p>
                                            </div>
                                        </div>
                                </div>
                            </div>    
                        {this.props.friends.map((item,index) => {
                            return(
                                <div id={item.id} onClick={()=>{this.props.setWall(item)}} className={"row messages_list_item shadow "} key={index}>
                                    <div className="col-2" style={{padding:'0px'}}>
                                        <img alt="DP" className="listDP"src={item.displayPicture} />
                                    </div>
                                    <div className="col" style={{alignSelf:'center'}}>
                                        <div className="row">
                                            <div className="col-12">  
                                                <p className="message-list-name" style={{textAlign:'start'}}>{item.displayName}</p>
                                            </div>
                                            {/* <div className="col-12">
                                                <div className="time" style={{textAlign:'start'}}>
                                                    <p style={{marginBottom:'0px'}}>{'10 Posts'}</p>
                                                </div>
                                            </div> */}
                                        </div>
                                </div>
                            </div>    
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
}

export default PostList;

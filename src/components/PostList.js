import React from 'react';
import logo from './assets/pew.jpg'; 
import firebase from '../config/firebase'

class PostList extends React.Component {

    constructor(){
        super()
        this.state = {
            btnState:"Add Post",
            btnClass:'btn btn-primary'
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

    resizeImage = (base64Str, maxWidth, maxHeight) => {
        return new Promise((resolve) => {
          let img = new Image()
          img.src = base64Str
          img.onload = () => {
            let canvas = document.createElement('canvas')
            const MAX_WIDTH = maxWidth
            const MAX_HEIGHT = maxHeight
            let width = img.width
            let height = img.height
      
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width
                width = MAX_WIDTH
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height
                height = MAX_HEIGHT
              }
            }
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            ctx.drawImage(img, 0, 0, width, height)
            resolve(canvas.toDataURL('image/jpeg', 1.0))
          }
        })
      }

    fileUpload = async(e) => {
        this.props.setUploading(true);

        this.setState({btnState:'Uploading',btnClass:'btn btn-warning'})
        let file = e.target.files[0];
        
        this.getBase64(file, (result) => {
            this.resizeImage(result,200,200).then(data => {
                var time = new Date().getTime();
                var storageRef = firebase.storage().ref();                
                console.log(data)

                var uploadTask = storageRef.child('posts/'+this.props.user.uid+'/'+time).putString(data, "data_url", {contentType:'image/jpeg'});                
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
                                this.props.setUploading(false);
                                this.setState({btnState:'Uploaded',btnClass:'btn btn-success'})
                            })
                    });
                }
                );

            })
            // document.getElementById("UserDP").src = result;            
        });
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
                            <label htmlFor="icon-button-file" style={{width:'100%'}} className="btn btn-danger">Upload Image</label>
                        </div>
                        <div id={this.props.user.uid} onClick={()=>{this.setMe()}} className={"row messages_list_item shadow "} key={this.props.user.id}>
                                    <div className="col-2" style={{padding:'0px'}}>
                                        {this.props.user.photoURL ?
                                            <img alt="DP" className="listDP"src={this.props.user.photoURL} />
                                            :
                                            <img alt="DP" className="listDP"src={logo} />
                                        }
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

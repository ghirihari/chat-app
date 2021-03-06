import React from 'react';
import logo from './assets/pew.jpg'; 
import firebase from '../config/firebase'
import '../App.css';
import Settings from './assets/settings.png'

class SettingScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message:null,
            messages:[],
            record:{displayName:null,email:null,photoURL:null},
            downloadUrl:logo,
            username:"",
            email:"",
            oldPass:"",
            newPass:"",
            key:"",
            status:{text:'Update',class:'btn btn-primary'},
            PassStatus:{text:'Change Password',class:'btn btn-danger'},
            dpStatus:'Change Profile Picture',
            dpClass:'btn btn-warning'
        }
    }

    usernameTyped = (event) => {
        this.setState({username: event.target.value});
    }

    emailTyped = (event) => {
        this.setState({email: event.target.value});
    }

    oldPassTyped = (event) => {
        this.setState({oldPass: event.target.value});
    }

    newPassTyped = (event) => {
        this.setState({newPass: event.target.value});
    }

    keyTyped = (event) => {
        this.setState({key: event.target.value});
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

    fetchUserData = () => {
        this.setState({searched:null,error:null})
        fetch("https://garnet-gregarious-robe.glitch.me/FetchUser?uid="+this.props.uid)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                this.setState({record:data.record,username:data.record.displayName,email:data.record.email})
                
                var httpsReference = firebase.storage().ref('dp/'+this.props.uid+'.jpg');  
                    httpsReference.getDownloadURL()
                    .then((url) => {this.setState({downloadUrl:url})})
                    .catch((error) => {console.log(error)});
                }
            else if(data.status===404){
                this.setState({error:'User Not Found'})
            }
        });
    }

    componentDidMount = () => {
        this.fetchUserData();
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

    
    fileUpload = (e) => {
        this.setState({dpStatus:"Uploading"})
        let file = e.target.files[0];
        
        this.getBase64(file, (result) => {
            this.resizeImage(result,200,200).then(data => {
                var storageRef = firebase.storage().ref();
                var uploadTask = storageRef.child('dp/'+this.props.uid+'.jpg').putString(data, "data_url", {contentType:'image/jpeg'});
                
                uploadTask.on('state_changed', 
                (snapshot) => {}, 
                (error) => {}, 
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        firebase.auth().currentUser.updateProfile({
                            photoURL: downloadURL
                          }).then(() => {
                            console.log('Saved at',downloadURL)
                            this.setState({dpStatus:"Uploaded",dpClass:"btn btn-success"})
                        }).catch((error) => {
                            console.log('error',error)
                        });
                    });
                }
                );
            });
            console.log('base64 Loaded');
            document.getElementById("UserDP").src = result;
        });
    }

    updateProfile = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/UpdateUser?uid="+this.props.uid+"&displayName="+this.state.username+"&email="+this.state.email)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                this.setState({status:{class:'btn btn-success',text:'Updated'},record:data.record,username:data.record.displayName,email:data.record.email})
            }
            else if(data.status===404){
                this.setState({error:'User Not Found'})
            }
        });
    }

    updatePass = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/UpdatePass?uid="+this.props.uid+"&oldPass="+this.state.oldPass+"&newPass="+this.state.newPass)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                console.log("Success")
                this.setState({PassStatus:{class:'btn btn-success',text:'Updated'}})

            }
            else if(data.status===404){
                this.setState({error:'User Not Found'})
            }
        });
    }

    changeKey = (data) => {
        this.props.setPrivate(data);
        // window.location.reload(); 

    }
  
    render(){
        return(
            <div className="chat-col" >
                {!this.props.menu ?
                    <div className="chat-col" style={{justifyContent:'center'}}>
                        <div style={{textAlign:'center'}}>
                            <img src={Settings} alt="Illustration" className="illustration"></img>
                        </div>
                    </div> 
                :
                // Title
                <div className="chat-title shadow" style={{display: 'flex',alignItems: 'center',justifyContent: 'center', height: '75px',textAlign: 'center'}}>
                    <div onClick={()=>this.props.unSetSettings()}>
                        <svg className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492" >
                            <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z" />
                        </svg>
                    </div>
                    <div style={{display:'block',alignSelf: 'center', paddingLeft:'10px', flexGrow:'1'}}>
                        <h5 className="recepient_name" style={{marginBottom:'0px'}}>{this.props.menu}</h5>
                    </div>
                </div>   
                }

                {this.props.menu==="Edit Profile" &&
                    <div className="update-form">
                        <div style={{textAlign:'center'}}>
                            <img id="UserDP" alt="DP" className="updateDP" src={this.state.downloadUrl} />
                            <div>
                                <input hidden id="icon-button-file" type="file" onChange={this.fileUpload}/>
                                <label htmlFor="icon-button-file" className={this.state.dpClass} style={{marginTop:'10px'}}>
                                    {this.state.dpStatus}
                                </label>
                            </div>
                        </div>
                    <div className="form-group">
                        <label>Username</label>
                        <input className="form-control" placeholder="Enter Username" value={this.state.username} onChange={this.usernameTyped}/>
                        <small id="usernameHelp" className="form-text text-muted">Should only contain letters and be within 30 characters.</small>
                    </div>
                    <div className="form-group">
                        <label>Email ID</label>
                        <input type="email" className="form-control"placeholder="Enter email" value={this.state.email} onChange={this.emailTyped}/>
                        <small id="emailHelp" className="form-text text-muted">Should be a valid email address.</small>
                    </div>
                    <div style={{textAlign:'end'}}>
                        <button type="submit" className={this.state.status.class} onClick={this.updateProfile}>{this.state.status.text}</button>
                    </div>
                </div>
                }

                {/* Password */}
                {this.props.menu==="Change Password" &&
                    <div className="update-form">
                        <div className="form-group">
                            <label>Old Password</label>
                            <input type="password" className="form-control"placeholder="New Password" onChange={this.oldPassTyped}/>
                            <small id="passwordHelp" className="form-text text-muted">Should have more than 8 characters.</small>
                        </div>
                        <div className="form-group">
                            <label>New Password</label>
                            <input type="password" className="form-control"placeholder="New Password" onChange={this.newPassTyped}/>
                            <small id="passwordHelp" className="form-text text-muted">Should have more than 8 characters.</small>
                        </div>
                        <div style={{textAlign:'end'}}>
                            <button type="submit" className={this.state.PassStatus.class} onClick={this.updatePass}>{this.state.PassStatus.text}</button>
                        </div>
                </div>
                }

                {this.props.menu==="Change Encryption Key" &&
                    <div className="update-form">
                        <div className="form-group">
                            <label>Change Encryption Key</label>
                            <input type="password" className="form-control key" placeholder="Key" value={this.state.key} onChange={this.keyTyped}/>
                        </div>
                        <div style={{textAlign:'end'}}>
                            <button type="submit" className="btn btn-danger" style={{marginRight:'5px'}} onClick={()=>this.changeKey("")}>Clear</button>
                            <button type="submit" className="btn btn-primary" onClick={()=>this.changeKey(this.state.key)}>Submit</button>
                        </div>
                    </div>                
                }
            </div>
        )
    }

}

export default SettingScreen;
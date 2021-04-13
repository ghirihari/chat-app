import React from 'react';
import logo from './assets/pew.jpg'; 
import firebase from '../config/firebase'
import '../App.css';

class SettingScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message:null,
            messages:[],
            record:{displayName:null,email:null,photoURL:null},
            downloadUrl:logo,
            username:null,
            email:null,
            oldPass:null,
            newPass:null,
            status:{text:'Update',class:'btn btn-primary'},
            PassStatus:{text:'Change Password',class:'btn btn-danger'}
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
            if(data.status==200){
                this.setState({record:data.record,username:data.record.displayName,email:data.record.email})
                
                var httpsReference = firebase.storage().ref('dp/'+this.props.uid+'.jpg');  
                    httpsReference.getDownloadURL()
                    .then((url) => {this.setState({downloadUrl:url})})
                    .catch((error) => {console.log(error)});
                }
            else if(data.status==404){
                this.setState({error:'User Not Found'})
            }
        });
    }

    componentDidMount = () => {
        this.fetchUserData();
    }
    
    fileUpload = (e) => {
        let file = e.target.files[0];
        
        this.getBase64(file, (result) => {
            console.log('base64 Loaded');
            document.getElementById("UserDP").src = result;
        });
    
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child('dp/'+this.props.uid+'.jpg').put(file);
        
        uploadTask.on('state_changed', 
        (snapshot) => {}, 
        (error) => {}, 
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                firebase.auth().currentUser.updateProfile({
                    photoURL: downloadURL
                  }).then(function() {
                    console.log('Saved at',downloadURL)
                }).catch(function(error) {
                    console.log('error',error)
                });
            });
        }
        );
    }

    updateProfile = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/UpdateUser?uid="+this.props.uid+"&displayName="+this.state.username+"&email="+this.state.email)
        .then(response => response.json())
        .then(data => {
            if(data.status==200){
                this.setState({status:{class:'btn btn-success',text:'Updated'},record:data.record,username:data.record.displayName,email:data.record.email})
            }
            else if(data.status==404){
                this.setState({error:'User Not Found'})
            }
        });
    }

    updatePass = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/UpdatePass?uid="+this.props.uid+"&oldPass="+this.state.oldPass+"&newPass="+this.state.newPass)
        .then(response => response.json())
        .then(data => {
            if(data.status==200){
                console.log("Success")
                this.setState({PassStatus:{class:'btn btn-success',text:'Updated'}})

            }
            else if(data.status==404){
                this.setState({error:'User Not Found'})
            }
        });
    }
  
    render(){
        return(
            <div className="chat-col" style={{justifyContent:'center'}}>
                {!this.props.menu &&
                <div style={{textAlign:'center'}}>
                    <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Settings</h1>
                    <h2 style={{fontSize:'20px',marginTop:'-25px',fontStyle:'italic'}}>Click a friend to view his Stories</h2>
                </div>
                }

                {this.props.menu=="Edit" &&
                    <div className="update-form">
                        <div style={{textAlign:'center'}}>
                            <img id="UserDP" alt="DP" className="updateDP" src={this.state.downloadUrl} />
                            <div>
                                <input hidden id="icon-button-file" type="file" onChange={this.fileUpload}/>
                                <label htmlFor="icon-button-file" className="btn btn-warning upload-on-image">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style={{width:'20px'}}>
                                        <path d="M51.2 353.28L0 512l158.72-51.2zM87.16 316.492L336.96 66.69l108.61 108.61L195.77 425.102zM504.32 79.36L432.64 7.68c-10.24-10.24-25.6-10.24-35.84 0l-23.04 23.04 107.52 107.52 23.04-23.04c10.24-10.24 10.24-25.6 0-35.84z" />
                                    </svg>
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
                    {/* <div className="form-group">
                        <label>Password</label>
                        <input type="password" className="form-control"placeholder="New Password"/>
                        <small id="passwordHelp" className="form-text text-muted">Should have more than 8 characters.</small>
                    </div> */}
                    <div style={{textAlign:'end'}}>
                        <button type="submit" className={this.state.status.class} onClick={this.updateProfile}>{this.state.status.text}</button>
                    </div>
                </div>
                }

                {/* Password */}
                {this.props.menu=="password" &&
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
                
            </div>
        )
    }

}

export default SettingScreen;

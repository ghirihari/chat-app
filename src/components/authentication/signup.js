import React from 'react';
import { Redirect } from "react-router-dom";
import firebase from '../../config/firebase'
import '../../App.css';
import logo from '../assets/pew.jpg'; 

class Signup extends React.Component {

    constructor(){
        super();
        this.state = {
        username:null,
        email:null,
        pass:null,
        room:'',
        redirect:false,
        btnStatus:'Register',
        btnClass:'btn btn-primary'
        }
    }

    usernameTyped = (event) => {
        this.setState({username: event.target.value});
    }

    emailTyped = (event) => {
        this.setState({email: event.target.value});
    }

    passTyped = (event) => {
        this.setState({pass: event.target.value});
    }

    //https://garnet-gregarious-robe.glitch.me/register/?email=mikasa@titans.com&pass=mikasaeren&username=Mikasa%20Ackerman
    register = () =>{
      this.setState({btnStatus:'Registering',btnClass:'btn-success'})

      firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.pass)
      .then(async(userCredential) => {
        var user = userCredential.user;
        var res =  await this.addUserData(user.uid,this.state.username)
        this.setState({btnStatus:'Registered',btnClass:'btn-success'})
      })
      .catch((error) => {
        this.setState({error:error})
      });
    }

    addUserData = (uid,username) => {
      return new Promise(function(resolve, reject) {
        let d = new Date();
        firebase.database().ref('users/' + uid).set({
          joined:d.getTime(),
          displayName:username
        }, (error) => {
            if (error) {
              resolve({status:'500',message:error})
            } else {
              resolve({status:'200',message:'Registered'})
            }
        });
      })
  }

    fileUpload = (e) => {
      let file = e.target.files[0];
      this.getBase64(file, (result) => {
            console.log('base64',result);
      });
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

  render(){
    if(this.state.btnStatus==='Registered')
    {
      return <Redirect to={"/chats"} />
    }
    else{
      return (
        <div className="container join-form">
            <div className="col-lg-6 col-sm-12">
                <div style={{textAlign:'center'}}>
                  <h3 className="title_font">Instance</h3>
              
                </div>
                <div className="row">
                  {/* DP Column */}
                  <div className="col-lg-6 col-sm-12" style={{alignSelf:'center'}}>
                    <div style={{textAlign:'center'}}>
                      <img id="UserDP" alt="DP" className="updateDP" src={logo} />
                      <div>
                        <button className="btn btn-outline-light changeDP">Change Profile Picture</button>
                      </div>
                    </div>
                  </div>
                  {/* Form Column */}
                  <div className="col-lg-6 col-sm-12">
                    <div className="form-group">
                        <input className="form-control" placeholder="Username" onChange={this.usernameTyped}/>
                    </div>
                    <div className="form-group">
                        <input className="form-control" placeholder="Email ID" onChange={this.emailTyped}/>
                    </div>        
                    <div className="form-group">
                        <input className="form-control" placeholder="Password" onChange={this.passTyped}/>
                    </div>
                    <div className="form-group">
                      <button className={"form-control "+this.state.btnClass} onClick={this.register}>{this.state.btnStatus}</button>
                    </div>
                    {this.state.error &&
                      <div className="form-group error-card">
                        <p className="paragraphs">{this.state.error.message}</p>
                      </div>
                    }
                    <div className="form-group signup-card">
                      <p className="paragraphs">Already a member? </p><a href="/login">Log in</a>
                    </div>

                  </div>
                </div>
            </div>
        </div>
      );
    }
  }
}

export default Signup;

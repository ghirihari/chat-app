import React from 'react';
// import io from "socket.io-client";
import { Redirect } from "react-router-dom";
// import firebase from '../../config/firebase'
import '../../App.css';

class Signup extends React.Component {

    constructor(){
        super();
        this.state = {
        username:null,
        email:null,
        pass:null,
        room:'',
        redirect:false,
        status:'Register'
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

    addUserData = (user) => {
      fetch("https://garnet-gregarious-robe.glitch.me/addUserData?uid="+user.uid+"&username="+this.state.username)
      .then(res => console.log(res))
    }

    //https://garnet-gregarious-robe.glitch.me/register/?email=mikasa@titans.com&pass=mikasaeren&username=Mikasa%20Ackerman
    register = () =>{
      this.setState({status:'Registering'})
      fetch("https://garnet-gregarious-robe.glitch.me/register/?email="+this.state.email+"&pass="+this.state.pass+"&username="+this.state.username)
      .then(response => response.json())
      .then(data => this.setState({status:data.message}));
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
    if(this.state.redirect)
    {
      return <Redirect to={"/room/"+this.state.room+'/'+this.state.username} />
    }
    else{
      return (
        <div className="container join-form">
            <div className="col-lg-4 col-sm-12">
                <div style={{textAlign:'center'}}>
                  <h1 className="title_font">Chatter</h1>
                </div>

                <div className="form-group">
                    <input className="form-control" placeholder="Username" onChange={this.usernameTyped}/>
                </div>
                <div className="form-group">
                    <input className="form-control" placeholder="Email ID" onChange={this.emailTyped}/>
                </div>        
                <div className="form-group">
                    <input className="form-control" placeholder="Password" onChange={this.passTyped}/>
                </div>

                {/* <div className="form-group">
                  <input hidden id="icon-button-file" type="file" onChange={this.fileUpload}/>
                  <label className="form-control btn btn-outline-secondary" htmlFor="icon-button-file">Upload Display Picture</label>
                </div> */}

                <div className="form-group">
                  <button className="form-control btn btn-primary" onClick={this.register}>{this.state.status}</button>
                </div>

                <div className="form-group signup-card">
                  <p className="paragraphs">Already a member? </p><a href="/login">Log in</a>
                </div>

            </div>
        </div>
      );
    }
  }
}

export default Signup;

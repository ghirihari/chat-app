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

    addUserData = (user) => {
      fetch("https://garnet-gregarious-robe.glitch.me/addUserData?uid="+user.uid+"&username="+this.state.username)
      .then(res => console.log(res))
    }

    //https://garnet-gregarious-robe.glitch.me/register/?email=mikasa@titans.com&pass=mikasaeren&username=Mikasa%20Ackerman
    register = () =>{
      this.setState({btnStatus:'Registering',btnClass:'btn-success'})
      fetch("https://garnet-gregarious-robe.glitch.me/register/?email="+this.state.email+"&pass="+this.state.pass+"&username="+this.state.username)
      .then(response => response.json())
      .then(data => {
        if(data.status===500){
          this.setState({error:data.message})
          this.setState({btnStatus:'Register',btnClass:'btn-primary'})
        }else if(data.status===200){
          this.setState({btnStatus:'Registered',btnClass:'btn-success'})
        }
      });
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
            <div className="col-lg-4 col-sm-12">
                <div style={{textAlign:'center'}}>
                  <h1 className="title_font">Instance</h1>
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

                {this.state.error &&
                  <div className="form-group error-card">
                    <p className="paragraphs">{this.state.error.message}</p>
                  </div>
                }

                <div className="form-group">
                  <button className={"form-control "+this.state.btnClass} onClick={this.register}>{this.state.btnStatus}</button>
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

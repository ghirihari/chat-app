import React from 'react';
import { Redirect } from "react-router-dom";
import firebase from '../../config/firebase'
import '../../App.css';
// import QR from '../assets/qrcode.png'; 

class Login extends React.Component {

    constructor(){
        super();
        this.state = {
            email:null,
            pass:null,
            redirect:false,
        }
    }

    emailTyped = (event) => {this.setState({email: event.target.value});}
    passTyped = (event) => {this.setState({pass: event.target.value});}


    login = () =>{
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
        .then((userCredential) => {
            // var user = userCredential.user;
            this.setState({redirect:true})
        })
        .catch((error) => {
            // var errorCode = error.code;
            // var errorMessage = error.message;
            console.log(error)
        });
    }

    componentDidMount = () => {

    }
  render(){
    if(this.state.redirect)
    {
      return <Redirect to={"/chats/"} />
    }
    else{
      return (
        <div className="container join-form">
            <div className="col-lg-4 col-sm-12">
                <div style={{textAlign:'center'}}>
                  <h1 className="title_font">Chatter</h1>
                </div>
                <div className="form-group">
                    <input className="form-control login-input-field" placeholder="Username" onChange={this.emailTyped}/>
                </div>
            
                <div className="form-group">
                    <input type="password" className="form-control login-input-field" placeholder="Password" onChange={this.passTyped}/>
                </div>

                <div className="form-group">
                  <button className="form-control btn btn-primary" onClick={this.login}>Log in</button>
                </div>

                <div className="form-group signup-card">
                  <p className="paragraphs">Don't have an account? </p><a href="/signup">Sign up</a>
                </div>


            </div>
        </div>
      );
    }
  }
}

export default Login;

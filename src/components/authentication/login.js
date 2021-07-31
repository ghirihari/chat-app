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
            btnStatus: 'Log in',
            btnClass:' btn btn-primary',
            error:null,
            signup:false
        }
    }

    emailTyped = (event) => {this.setState({email: event.target.value});}
    passTyped = (event) => {this.setState({pass: event.target.value});}


    login = () =>{
        this.setState({btnStatus:'Logging in',btnClass:'btn btn-success',error:null})
        firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.pass)
        .then((userCredential) => {
            // var user = userCredential.user;
            this.setState({redirect:true})
        })
        .catch((error) => {
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // console.log(error)
            this.setState({btnStatus:'Log in',btnClass:'btn btn-primary'})
            this.setState({error:error})
        });
    }

    componentDidMount = () => {

    }
  render(){
    if(this.state.redirect)
    {
      return <Redirect to={"/chats/"} />
    }
    if(this.state.signup)
    {
      return <Redirect to={"/signup/"} />
    }
    else{
      return (
        <div className="container join-form">
            <div className="col-lg-4 col-sm-12">
                <div style={{textAlign:'center'}}>
                  <h1 className="title_font">Instance</h1>
                </div>
                <div className="form-group">
                    <input className="form-control login-input-field" placeholder="Email ID" onChange={this.emailTyped}/>
                </div>
            
                <div className="form-group">
                    <input type="password" className="form-control login-input-field" placeholder="Password" onChange={this.passTyped}/>
                </div>

                {this.state.error &&
                  <div className="form-group error-card">
                    <p className="paragraphs">{this.state.error.message}</p>
                  </div>
                }

                <div className="form-group">
                  <button className={"form-control "+this.state.btnClass} onClick={this.login}>{this.state.btnStatus}</button>
                </div>

                <div className="form-group signup-card">
                  <p className="paragraphs">Don't have an account? </p><a role="button" style={{color: '#0056b3', cursor: 'pointer'}} onClick={()=>this.setState({signup:true})}>Sign up</a>
                </div>


            </div>
        </div>
      );
    }
  }
}

export default Login;

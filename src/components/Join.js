import React from 'react';
// import io from "socket.io-client";
import { Redirect } from "react-router-dom";
import '../App.css';

class Join extends React.Component {

  constructor(){
    super();
    this.state = {
      username: '',
      room:'',
      redirect:false
    }
  }

  usernameTyped = (event) => {
    this.setState({username: event.target.value});
  }

  roomTyped = (event) => {
    this.setState({room: event.target.value});
  }

  joinroom = () =>{
    this.setState({redirect:true})
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
                <div className="form-group">
                <label >Username</label>
                <input className="form-control" placeholder="Enter Username" onChange={this.usernameTyped}/>
                </div>
                <div className="form-group">
                <label >Room Id</label>
                <input className="form-control" placeholder="Enter Room ID" onChange={this.roomTyped}/>
                </div>

                <div className="form-group">
                  <button className="form-control btn btn-warning" onClick={this.joinroom}>Join</button>
                </div>
            </div>
        </div>
      );
    }
  }
}

export default Join;

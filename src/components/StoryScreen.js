import React from 'react';
import logo from './assets/pew.jpg'; 
import firebase from '../config/firebase'
import '../App.css';

class StoryScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message:null,
            messages:[],
        }
    }

    render(){
        return(
            <div className="chat-col" style={{justifyContent:'center'}}>
                <div style={{textAlign:'center'}}>
                    <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Stories</h1>
                    <h2 style={{fontSize:'20px',marginTop:'-25px',fontStyle:'italic'}}>Click a friend to view his Stories</h2>
                </div>
            </div>
        )
    }

}

export default StoryScreen;

import React from 'react';
import GoogleMapReact from 'google-map-react';
import firebase from '../config/firebase'
import '../App.css';

const AnyReactComponent = (props) => {
    return(
        <div>
            <div className="map-marker">
                <img alt='DP' src={props.dp} className="map-marker-dp"/>
                <span className="badge badge-dark" style={{fontSize:'small'}}>{props.text}</span>
            </div>
        </div>
    )   
}

class StoryScreen extends React.Component {

    constructor(props){
        super(props);
        this.state ={
            message:null,
            messages:[],
            friends:[]
        }
    }

    fetchFriends = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/friends?uid="+this.props.uid)
        .then(response => response.json())
        .then(data => {
            var friends = []
            data.map((item,index) => {
                firebase.database().ref('location/' + item.id).once('value', (snapshot) => {
                    if(snapshot.val())
                    {
                        friends = friends.concat({
                            id:item.id,
                            displayName:item.displayName,
                            displayPicture:item.displayPicture,
                            location:snapshot.val()
                        })
                        this.setState({friends:friends})
                    }
                });
            })
            
        })
    }

    componentDidMount = () => {
        this.fetchFriends();
    }

    render(){
        return(
            <div className="chat-col" style={{justifyContent:'center'}}>
                <div className="chat-title shadow" style={{display: 'flex',alignItems: 'center',justifyContent: 'center', height: '75px',textAlign: 'center'}}>
                    <div onClick={()=>this.props.unSetMapMode()}>
                        <svg className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 492 492" >
                            <path d="M198.608 246.104L382.664 62.04c5.068-5.056 7.856-11.816 7.856-19.024 0-7.212-2.788-13.968-7.856-19.032l-16.128-16.12C361.476 2.792 354.712 0 347.504 0s-13.964 2.792-19.028 7.864L109.328 227.008c-5.084 5.08-7.868 11.868-7.848 19.084-.02 7.248 2.76 14.028 7.848 19.112l218.944 218.932c5.064 5.072 11.82 7.864 19.032 7.864 7.208 0 13.964-2.792 19.032-7.864l16.124-16.12c10.492-10.492 10.492-27.572 0-38.06L198.608 246.104z" />
                        </svg>
                    </div>
                    <div style={{display:'block',alignSelf: 'center', paddingLeft:'10px', flexGrow:'1'}}>
                        <h5 className="recepient_name" style={{marginBottom:'0px'}}>Maps</h5>
                    </div>
                </div>   

                <GoogleMapReact
                    bootstrapURLKeys={{ key:'AIzaSyB9DoWtMzN1UUmWdhqWJ9MSQQAMvC3pSww' }}
                    defaultCenter={{lat: 11.01,lng: 77.00}}
                    defaultZoom={12}>
                            {this.state.friends.map((item,index) => {
                                console.log(item.location.latitude)
                                return(
                                    <AnyReactComponent
                                        key={item.id}
                                        lat={item.location.latitude}
                                        lng={item.location.longitude}
                                        text={item.displayName}
                                        dp={item.displayPicture}/>
                                )
                            })}
                </GoogleMapReact>
            
            </div>
        )
    }

}

export default StoryScreen;

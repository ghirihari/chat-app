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
                {/* <div style={{textAlign:'center'}}>
                    <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Stories</h1>
                    <h2 style={{fontSize:'20px',marginTop:'-25px',fontStyle:'italic'}}>Click a friend to view his Stories</h2>
                </div> */}
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

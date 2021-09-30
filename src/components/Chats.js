import React from 'react';
import '../App.css';
import firebase from '../config/firebase';
import MainScreen from './MainScreen';
import CryptoJS from 'crypto-js';
import Sidebar from './Sidebar'
import Loader from './Loader';

class Chats extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        user:null,
        occupants:[],
        message:null,
        sms:[],
        fid:'',
        recipient:null,
        menu:'Chats',
        searched:null,
        error:null,
        friends:null,
        settingsMenu:null,
        chatData:null,
        wall:null,
        wallData:null,
        addFriendStatus:"Add",
        addFriendClass:"btn btn-primary",
        ChatScreenClass:"col-lg-9 d-none d-lg-block",
        MessageListClass:"col-lg-3 col-sm-12 contacts_col",
        private:localStorage.private,
        uploading:false
        }
    } 

    setUploading = (flag) => {
        this.setState({uploading:flag})
    }

    setPrivate = (key) => {
        var k = new Buffer(key);
        this.setState({private:k.toString('base64')})
        localStorage.private = k.toString('base64')
        this.renderFriends(this.state.user);
        this.getChats();    
    }

    setMenu = (menu) => {
        switch(menu){
            case 'Chats':
                this.setState({menu:'Chats',recipient:null})
                break;
            case 'Add Friends':
                this.setState({menu:'Add Friends'})
                break;
            case 'Posts':
                this.setState({menu:'Posts'})
                break;
            case 'Settings':
                this.setState({menu:'Settings'})
                break;    
        }
    }

    setWall = (item) => {
        this.setState({
            recipient:item,
            ChatScreenClass:"col-lg-9",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col d-none d-lg-block"
        });

        firebase.database().ref('posts/' + item.id).on('value', (snapshot) => {
            if(snapshot.val())
            {
                this.setState({wallData:snapshot.val(),wall:item})
            }else{
                this.setState({wallData:'None',wall:item})
            }
        });
    }

    unSetWall = () => {
        this.setState({
            recipient:null,
            wallData:'None',
            wall:null,
            ChatScreenClass:"col-lg-9 d-none d-lg-block",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col"    
        })
    }

    setRec = (item) => {
        this.setState(
            {
                recipient:item,
                menu:'Chats',
                ChatScreenClass:"col-lg-9",
                MessageListClass:"col-lg-3 col-sm-12 contacts_col d-none d-lg-block"
            })
    }

    unSetRec = () => {
        this.setState({
            recipient:null,
            menu:'Chats',
            ChatScreenClass:"col-lg-9 d-none d-lg-block",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col"    
        })
    }

    setSettings = (type) => {
        this.setState({
            settingsMenu:type,
            ChatScreenClass:"col-lg-9",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col d-none d-lg-block"
        });
    }

    unSetSettings= () => {
        this.setState({
            settingsMenu:null,
            ChatScreenClass:"col-lg-9 d-none d-lg-block",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col"                
        })
    }

    mapMode = () => {
        this.setState({
            menu:'Friends-Map',
            recipient:null,
            ChatScreenClass:"col-lg-9",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col d-none d-lg-block"
        })
    }

    unSetMapMode = () => {
        this.setState({
            recipient:null,
            menu:'Chats',
            ChatScreenClass:"col-lg-9 d-none d-lg-block",
            MessageListClass:"col-lg-3 col-sm-12 contacts_col"    
        })
    }


    logout = () => {
        firebase.auth().signOut().then(function() {
            // Sign-out successful.
          }).catch(function(error) {
            // An error happened.
          });
    }

    addRecord = (id) => {
        let d = new Date();
        d = d.getTime();
        // Add in user's node
        firebase.database().ref('users/' + this.state.user.uid + '/friends/' + id).set({time:d}, 
        (error) => {
            // if (error) {console.log(error)} 
        });
        // add in friends node
        firebase.database().ref('users/' + id + '/friends/' + this.state.user.uid).set({time:d}, 
        (error) => {
            // if (error) {console.log(error)} 
        });

    }

    searchUsers = () => {
        this.setState({searched:null,error:null})
        fetch("https://garnet-gregarious-robe.glitch.me/SearchUserByMail?email="+this.state.fid)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                this.setState({searched:data.record})
            }
            else if(data.status===404){
                this.setState({error:'User Not Found'})
            }
        });
   
    }

    b64encode = (data) => {
        var b = new Buffer(data);
        var s = b.toString('base64');
        return s;      
    }

    addFriend = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/AddFriend?uid="+this.state.user.uid+"&fid="+this.state.searched.uid)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                var today = new Date();
                var dd = String(today.getDate()).padStart(2, '0');
                var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                var yyyy = today.getFullYear();
                today = mm + '/' + dd + '/' + yyyy;

                var message = 'Friends from '+today;
                var ciphertext = CryptoJS.AES.encrypt(message,'iamironman').toString();
                ciphertext = this.b64encode(ciphertext);

                fetch("https://garnet-gregarious-robe.glitch.me/send?from="+this.state.user.uid+"&to="+this.state.searched.uid+"&type=welcome"+"&message="+ciphertext)
                .then(response => response.json())
                .then(data => {
                    if(data.status===200){
                        this.setState({addFriendStatus:'Added',addFriendClass:'btn btn-success'})
                        // console.log('Friend Added')
                    }
                    else if(data.status===404){
                        console.error(data)
                    }
                });
            }
            else if(data.status===404){
                this.setState('Error')
            }
        });
    }

    occupantDupe = (uid) =>
    {
        for(var i = 0; i < this.state.occupants.length; i++)
        {
            if(this.state.occupants[i].id === uid)
            {
                return 1;
            }
        }
        return 0
    }

    renderFriends = (user) => {
        var chats = firebase.database().ref('users/' + user.uid + '/friends');
        chats.on('value', (snapshot) => {
            // console.log('friends')
            if(snapshot.val())
            {
                let data = snapshot.val();
                let fid = Object.entries(data);
                for (var i in fid){
                    fetch("https://garnet-gregarious-robe.glitch.me/FetchUser?uid="+fid[i][0]+"&pass="+this.state.private)
                        .then(response => response.json())
                        .then(data => {
                            // console.log(data)
                            if(data.status===200){
                                if(!this.occupantDupe(data.record.uid)){
                                    this.setState({occupants:this.state.occupants.concat({id:data.record.uid, displayName:data.record.displayName, displayPicture:data.record.photoURL, sharedKey:data.key})})
                                }
                            }
                            else if(data.status===404){
                                // console.log('error')
                            }
                        });
                
                    }
            }
        });
    }

    getChats = () => {
        let chats = firebase.database().ref('users/' + this.state.user.uid + '/messages/');

        chats.on('value', (snapshot) => {
            this.setState({chatData:snapshot.val()})
            // console.log('On',snapshot.val())
        });
        chats.on('child_changed', (data) => {
            let rec_id = this.state.recipient ? this.state.recipient.id : null;
            // console.log(data.key,rec_id)
            if(data.key !== rec_id){
                // console.log('Message Received')
                // console.log('message-list-'+data.key)
                // document.getElementById('message-list-'+data.key).classList.add('gradient')
            }
            // console.log('child_changed',data.key, data.val());
        });
          
    }

    success = (pos) => {
        var crd = pos.coords;
        firebase.database().ref('location/'+this.state.user.uid).set({latitude:crd.latitude, longitude:crd.longitude}) 
        // console.log("Your current position is:");
        // console.log(`Latitude : ${crd.latitude}`);
        // console.log(`Longitude: ${crd.longitude}`);
        // console.log(`More or less ${crd.accuracy} meters.`);
      }
      
    errors = (err) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
      }
    
    getLocation = () =>{
        if (navigator.geolocation) {
            var options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0,
              };
            navigator.permissions
                .query({ name: "geolocation" })
                .then((result)=> {
                if (result.state === "granted") {
                    // console.log(result.state);
                    navigator.geolocation.getCurrentPosition(this.success);
                } else if (result.state === "prompt") {
                    navigator.geolocation.getCurrentPosition(this.success, this.errors, options);
                } else if (result.state === "denied") {
                    //If denied then you have to show instructions to enable location
                }
                result.onchange = function () {
                    // console.log(result.state);
                };
                });
            } else {
            alert('Sorry Not available!');
        }
    }


    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({user:user})
                if(this.state.private)
                {
                    this.renderFriends(user);
                    this.getChats();    
                }
                // this.getLocation()
            } else {
                this.props.history.push('/login');
            }
        });
    }

    fidTyped = (event) => {
        this.setState({fid: event.target.value});
    }

   
  render(){
    //   console.log(this.state.addFriendClass,this.state.addFriendStatus)
        if(this.state.user && this.state.occupants.length && this.state.private){
            return (
                <div className="col">
                <div className="row" style={{height:'100vh'}}>
                    <Sidebar
                        recipient={this.state.recipient}
                        MessageListClass={this.state.MessageListClass}
                        setMenu={this.setMenu}
                        mapMode={this.mapMode}
                        menu={this.state.menu}
                        occupants={this.state.occupants}
                        setRec={this.setRec}
                        chatData={this.state.chatData}
                        user={this.state.user}
                        friends={this.state.occupants} 
                        setWall={this.setWall}
                        setSettings={this.setSettings}
                        logout={this.logout}
                        fidTyped={this.fidTyped}
                        fid={this.state.fid}
                        searchUsers={this.searchUsers}
                        searched={this.state.searched}
                        addFriend = {this.addFriend}
                        addFriendClass = {this.state.addFriendClass}
                        addFriendStatus = {this.state.addFriendStatus}
                        error={this.state.error}
                        setUploading={this.setUploading}
                    />
                    <MainScreen
                        ChatScreenClass = {this.state.ChatScreenClass}
                        menu = {this.state.menu}
                        recipient = {this.state.recipient}
                        user = {this.state.user}
                        chatData = {this.state.chatData}
                        wall = {this.state.wall}
                        wallData = {this.state.wallData}
                        settingsMenu = {this.state.settingsMenu}
                        unSetRec = {this.unSetRec}
                        unSetMapMode = {this.unSetMapMode}
                        unSetWall = {this.unSetWall}
                        unSetSettings = {this.unSetSettings}
                        uploading={this.state.uploading}
                     
                    />
                </div>
                </div>
            );
        }
        else{
            return(
                <Loader private={this.state.private} setPrivate={this.setPrivate}/>
            )
        }
    }
}

export default Chats;

import React from 'react';
import '../App.css';
import logo from './assets/pew.jpg'; 
import MessageList from './MessageList';
import firebase from '../config/firebase';
import ChatScreen from '../components/ChatScreen'
import StoriesList from './StoriesList'
import SettingsList from './SettingsList'
import StoryScreen from './StoryScreen'
import FriendScreen from './FriendScreen'
import SettingScreen from './SettingScreen'


class Chats extends React.Component {

  constructor(props){
    super(props);
    this.state = {
        user:null,
        occupants:[],
        message:null,
        sms:[],
        fid:null,
        recipient:null,
        menu:'Settings',
        searched:null,
        error:null,
        friends:null,
        settingsMenu:null
        }
    } 
    
    setRec = (item) => {
        // console.log(item)
        this.setState({recipient:item})
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
            if (error) {console.log(error)} 
        });
        // add in friends node
        firebase.database().ref('users/' + id + '/friends/' + this.state.user.uid).set({time:d}, 
        (error) => {
            if (error) {console.log(error)} 
        });

    }

    searchUsers = () => {
        this.setState({searched:null,error:null})
        fetch("https://garnet-gregarious-robe.glitch.me/SearchUserByMail?email="+this.state.fid)
        .then(response => response.json())
        .then(data => {
            if(data.status==200){
                console.log(data)
                this.setState({searched:data.record})
            }
            else if(data.status==404){
                this.setState({error:'User Not Found'})
            }
        });
   
    }

    addFriend = () => {
        fetch("https://garnet-gregarious-robe.glitch.me/AddFriend?uid="+this.state.uid+"&fid="+this.state.fid)
        .then(response => response.json())
        .then(data => {
            if(data.status==200){
                console.log('Friend Added')
            }
            else if(data.status==404){
                this.setState('Error')
            }
        });
    }

    renderFriends = (user) => {
        var chats = firebase.database().ref('users/' + user.uid + '/friends');
        chats.on('value', (snapshot) => {
            if(snapshot.val())
            {
                
                let data = snapshot.val();
                let fid = Object.entries(data);
                for (var i in fid){
                    // firebase.database().ref('users/' + fid[i][0]).once('value').then((snapshot) => {
                    //     if (snapshot.val()) {
                    //         this.setState({occupants:this.state.occupants.concat({id:snapshot.key,displayName:snapshot.val().displayName})})
                    //     }
                    // });
            
                    fetch("https://garnet-gregarious-robe.glitch.me/FetchUser?uid="+fid[i][0])
                        .then(response => response.json())
                        .then(data => {
                            if(data.status==200){
                                console.log(data.record)
                                this.setState({occupants:this.state.occupants.concat({id:data.record.uid, displayName:data.record.displayName, displayPicture:data.record.photoURL})})
                            }
                            else if(data.status==404){
                                console.log('error')
                            }
                        });
                
                    }
            }
        });
    }

    componentDidMount = () => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({user:user})
                this.renderFriends(user);
            } else {
                this.props.history.push('/login');
            }
          });

    //   this.socket = io('http://localhost:5000');
    //   this.socket.emit('joinroom',this.userid);
    //   this.socket.on('occupants', users => {
    //     console.log(users);
    //     this.setState({occupants:users})
    //   });
    //   this.socket.on('message_received', (message) => {
    //     console.log(message)
    //     this.setState({sms:this.state.sms.concat(message)})
    //   });
    }

    fidTyped = (event) => {
        this.setState({fid: event.target.value});
    }

   
  render(){
    //   console.log(this.state.occupants)
        if(this.state.user){
            return (
                <div className="container-fluid">
                <div className="row" style={{height:'100vh'}}>
                    <div className="col-3 contacts_col d-none d-lg-block">
                    <div>
                        {/* <div className="username_div">
                            <h2 style={{display:'contents'}}>
                                <span className="badge badge-secondary">{this.state.user.displayName[0]}</span>
                                <label className="username">{this.state.user.displayName}</label>
                            </h2>
                            <button className="btn btn-outline-danger float-right" onClick={this.logout}>Logout</button>
                        </div> */}
                         <div style={{textAlign:'center'}}>
                  <h1 className="title_font">Chatter</h1>
                </div>
               
                        {/* <div className="messages_list_group">
                            <div style={{display:"flex", alignItems:'center'}} className="gradient-0 messages_list_item shadow">
                                <div>
                                    <img style={{width:'100px'}} alt="DP" className="listDP"src={logo} />
                                </div>
                                <div className="Profile_Name" style={{flexGrow: '1'}}>  
                                    <h5 style={{margin:'0px 10px'}}>{this.state.user.displayName}</h5>
                                </div>
                                
                            </div>
                        </div> */}

                        {/* Icons*/}
                        <div className="row add-friends">
                            <div className="col icon-box">    
                                <svg onClick={()=>this.setState({menu:'Chats'})} className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.001 512.001">
                                    <path d="M468.53 306.575c-4.14-10.239-15.798-15.188-26.038-11.046-10.241 4.14-15.187 15.797-11.047 26.038L455 379.833l-69.958-30.839a20.002 20.002 0 00-15.917-.095c-23.908 10.201-49.52 15.373-76.124 15.373-107.073 0-179-83.835-179-162.136 0-89.402 80.299-162.136 179-162.136s179 72.734 179 162.136c0 6.975-.65 15.327-1.781 22.913-1.63 10.925 5.905 21.102 16.83 22.732 10.926 1.634 21.103-5.905 22.732-16.83 1.431-9.59 2.219-19.824 2.219-28.815 0-54.33-23.006-105.308-64.783-143.543C405.936 20.809 351.167 0 293.001 0S180.067 20.809 138.784 58.592c-37.332 34.168-59.66 78.516-63.991 126.335C27.836 216.023.001 265.852.001 319.525c0 33.528 10.563 65.34 30.67 92.717L1.459 484.504a19.998 19.998 0 004.621 21.855 19.989 19.989 0 0021.988 3.942l84.229-37.13c21.188 7.887 43.585 11.88 66.703 11.88.5 0 .991-.039 1.482-.075 33.437-.253 65.944-9.048 94.098-25.507 25.218-14.744 45.962-34.998 60.505-58.917a230.144 230.144 0 0041.547-11.551l107.301 47.3a20 20 0 0021.989-3.942 19.998 19.998 0 004.621-21.855L468.53 306.575zM179.002 445c-.273 0-.539.03-.81.041-20.422-.104-40.078-4.118-58.435-11.95a19.991 19.991 0 00-15.916.095l-46.837 20.646 15.109-37.375a20.001 20.001 0 00-3.322-20.47c-18.835-22.097-28.79-48.536-28.79-76.462 0-31.961 13.445-62.244 36.969-85.206 7.324 39.925 27.989 78.117 59.162 108.119 38.791 37.333 90.101 58.961 145.506 61.565C255.626 429.608 218.402 445 179.002 445z" />
                                    <circle cx={292.001} cy={203} r={20} />
                                    <circle cx={372.001} cy={203} r={20} />
                                    <circle cx={212.001} cy={203} r={20} />
                                </svg>
                            </div>

                            <div className="col icon-box">
                                <svg onClick={()=>this.setState({menu:'Status',recipient:null})} className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 568.705 568.705">
                                    <path d="M529.117 317.082c-16.576 0-31.23 10.682-36.342 26.454-27.636 85.372-107.769 147.314-202.232 147.314-117.274 0-212.688-95.424-212.688-212.707 0-94.075 61.43-173.951 146.278-201.901 16.383-5.398 27.483-20.716 27.483-37.985a38.253 38.253 0 00-15.737-30.924 38.255 38.255 0 00-34.251-5.492C84.793 39.468.001 148.976.001 278.147c0 160.218 130.332 290.558 290.541 290.558 128.654 0 237.793-84.126 275.828-200.219a39.183 39.183 0 00-5.514-35.2 39.166 39.166 0 00-31.739-16.204zM355.888 75.905c64.584 20.908 115.691 71.902 136.752 136.419a39.008 39.008 0 0037.103 26.906h.801a38.172 38.172 0 0030.848-15.69 38.204 38.204 0 005.476-34.174c-28.49-88.591-98.416-158.661-186.933-187.36a38.609 38.609 0 00-34.573 5.492 38.587 38.587 0 00-15.89 31.198v.847c-.004 16.556 10.676 31.258 26.416 36.362z" />
                                </svg>
                            </div>

                            <div className="col icon-box">
                                <svg onClick={()=>{this.setState({menu:'Add Friends'})}} className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                    <path d="M367.57 256.909a260.207 260.207 0 00-30.093-12.081C370.56 219.996 392 180.455 392 136 392 61.01 330.991 0 256 0S120 61.01 120 136c0 44.504 21.488 84.084 54.633 108.911-30.368 9.998-58.863 25.555-83.803 46.069-45.732 37.617-77.529 90.086-89.532 147.743-3.762 18.066.745 36.622 12.363 50.908C25.222 503.847 42.365 512 60.693 512H307c11.046 0 20-8.954 20-20s-8.954-20-20-20H60.693c-8.538 0-13.689-4.766-15.999-7.606-3.989-4.905-5.533-11.29-4.236-17.519 20.755-99.695 108.691-172.521 210.24-174.977a137.229 137.229 0 0010.656-.002c31.12.73 61.05 7.832 89.044 21.14 9.977 4.74 21.907.499 26.649-9.478 4.742-9.976.5-21.907-9.477-26.649zm-106.692-25.032a260.16 260.16 0 00-9.718.002C200.465 229.35 160 187.312 160 136c0-52.935 43.065-96 96-96s96 43.065 96 96c0 51.299-40.445 93.329-91.122 95.877z" />
                                    <path d="M492 397h-55v-55c0-11.046-8.954-20-20-20s-20 8.954-20 20v55h-55c-11.046 0-20 8.954-20 20s8.954 20 20 20h55v55c0 11.046 8.954 20 20 20s20-8.954 20-20v-55h55c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
                                </svg>
                            </div>

                            <div className="col icon-box">
                                <svg  className="sidebar-icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 431.972 431.972">
                                    <path d="M393.146 14.279c-3.713-5.333-8.713-9.233-14.989-11.707A31.606 31.606 0 00365.592.004V0H66.378c-4.377 0-8.562.857-12.56 2.568-6.28 2.472-11.278 6.377-14.989 11.707-3.71 5.33-5.568 11.228-5.568 17.701v368.019c0 6.475 1.858 12.371 5.568 17.706 3.711 5.329 8.709 9.233 14.989 11.704a31.577 31.577 0 0012.56 2.566c8.949 0 16.844-3.142 23.698-9.418l125.91-121.062 125.91 121.065c6.663 6.081 14.562 9.127 23.695 9.127 4.76 0 8.948-.756 12.565-2.279 6.276-2.471 11.276-6.375 14.989-11.711 3.71-5.328 5.564-11.225 5.564-17.699V31.98c.001-6.473-1.857-12.371-5.563-17.701zm-30.98 376.86L241.397 275.224l-25.411-24.264-25.409 24.264L69.809 391.139V36.549h292.357v354.59z" />
                                </svg>
                            </div>
                            
                            <div className="col icon-box">
                                <svg onClick={()=>this.setState({menu:'Settings'})} className="sidebar-icons" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M272.066 512h-32.133c-25.989 0-47.134-21.144-47.134-47.133v-10.871a206.698 206.698 0 01-32.097-13.323l-7.704 7.704c-18.659 18.682-48.548 18.134-66.665-.007l-22.711-22.71c-18.149-18.129-18.671-48.008.006-66.665l7.698-7.698A206.714 206.714 0 0158.003 319.2h-10.87C21.145 319.2 0 298.056 0 272.067v-32.134C0 213.944 21.145 192.8 47.134 192.8h10.87a206.755 206.755 0 0113.323-32.097L63.623 153c-18.666-18.646-18.151-48.528.006-66.665l22.713-22.712c18.159-18.184 48.041-18.638 66.664.006l7.697 7.697A206.893 206.893 0 01192.8 58.003v-10.87C192.8 21.144 213.944 0 239.934 0h32.133C298.056 0 319.2 21.144 319.2 47.133v10.871a206.698 206.698 0 0132.097 13.323l7.704-7.704c18.659-18.682 48.548-18.134 66.665.007l22.711 22.71c18.149 18.129 18.671 48.008-.006 66.665l-7.698 7.698a206.714 206.714 0 0113.323 32.097h10.87c25.989 0 47.134 21.144 47.134 47.133v32.134c0 25.989-21.145 47.133-47.134 47.133h-10.87a206.755 206.755 0 01-13.323 32.097l7.704 7.704c18.666 18.646 18.151 48.528-.006 66.665l-22.713 22.712c-18.159 18.184-48.041 18.638-66.664-.006l-7.697-7.697a206.893 206.893 0 01-32.097 13.323v10.871c0 25.987-21.144 47.131-47.134 47.131zM165.717 409.17a176.812 176.812 0 0045.831 19.025 14.999 14.999 0 0111.252 14.524v22.148c0 9.447 7.687 17.133 17.134 17.133h32.133c9.447 0 17.134-7.686 17.134-17.133v-22.148a14.999 14.999 0 0111.252-14.524 176.812 176.812 0 0045.831-19.025 15 15 0 0118.243 2.305l15.688 15.689c6.764 6.772 17.626 6.615 24.224.007l22.727-22.726c6.582-6.574 6.802-17.438.006-24.225l-15.695-15.695a15 15 0 01-2.305-18.242 176.78 176.78 0 0019.024-45.831 15 15 0 0114.524-11.251h22.147c9.447 0 17.134-7.686 17.134-17.133v-32.134c0-9.447-7.687-17.133-17.134-17.133H442.72a15 15 0 01-14.524-11.251 176.815 176.815 0 00-19.024-45.831 15 15 0 012.305-18.242l15.689-15.689c6.782-6.774 6.605-17.634.006-24.225l-22.725-22.725c-6.587-6.596-17.451-6.789-24.225-.006l-15.694 15.695a15 15 0 01-18.243 2.305 176.812 176.812 0 00-45.831-19.025 14.999 14.999 0 01-11.252-14.524v-22.15c0-9.447-7.687-17.133-17.134-17.133h-32.133c-9.447 0-17.134 7.686-17.134 17.133v22.148a14.999 14.999 0 01-11.252 14.524 176.812 176.812 0 00-45.831 19.025 15.002 15.002 0 01-18.243-2.305l-15.688-15.689c-6.764-6.772-17.627-6.615-24.224-.007l-22.727 22.726c-6.582 6.574-6.802 17.437-.006 24.225l15.695 15.695a15 15 0 012.305 18.242 176.78 176.78 0 00-19.024 45.831 15 15 0 01-14.524 11.251H47.134C37.687 222.8 30 230.486 30 239.933v32.134c0 9.447 7.687 17.133 17.134 17.133h22.147a15 15 0 0114.524 11.251 176.815 176.815 0 0019.024 45.831 15 15 0 01-2.305 18.242l-15.689 15.689c-6.782 6.774-6.605 17.634-.006 24.225l22.725 22.725c6.587 6.596 17.451 6.789 24.225.006l15.694-15.695c3.568-3.567 10.991-6.594 18.244-2.304z" />
                                    <path d="M256 367.4c-61.427 0-111.4-49.974-111.4-111.4S194.573 144.6 256 144.6 367.4 194.574 367.4 256 317.427 367.4 256 367.4zm0-192.8c-44.885 0-81.4 36.516-81.4 81.4s36.516 81.4 81.4 81.4 81.4-36.516 81.4-81.4-36.515-81.4-81.4-81.4z" />
                                </svg>
                            </div>

                        </div>
                        
                        {/* Sidebar menu */}
                        <div style={{textAlign:'center'}}>
                            <label className="sub_Heading" style={{margin:'0px 15px'}}>{this.state.menu}</label>
                        </div>                        

                        {this.state.menu=="Chats" &&
                            <div>
                                <MessageList 
                                    users={this.state.occupants} 
                                    type={"request"}
                                    setRec={this.setRec}
                                />
                            </div>
                        }
                        
                        {this.state.menu=="Status" &&
                            <StoriesList/>
                        }

                        {this.state.menu=="Settings" &&
                            <div className="col" style={{marginTop:'10px'}}>
                                <div>
                                    <button className="btn btn-dark ListButtons" onClick={()=>this.setState({settingsMenu:'Edit'})}>Edit Profile</button>
                                </div>
                                <div>
                                    <button className="btn btn-dark ListButtons" onClick={()=>this.setState({settingsMenu:'password'})}>Change Password</button>
                                </div>
                                <div>
                                    <button className="btn btn-danger ListButtons" onClick={this.logout}>Logout</button>
                                </div>
                            </div>
                            // <SettingsList/>
                        }

                        

                        {this.state.menu=="Add Friends" &&
                            <>
                            <div className="search shadow">
                                <div className="input-group add-friends-input">
                                    <input type="text" className="form-control" placeholder="Search" onChange={this.fidTyped}/>
                                    <div className="input-group-append">
                                    <button className="btn btn-dark"  type="button" onClick={this.searchUsers}>
                                        <svg fill="white" width="20px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.005 512.005">
                                            <path d="M505.749 475.587l-145.6-145.6c28.203-34.837 45.184-79.104 45.184-127.317C405.333 90.926 314.41.003 202.666.003S0 90.925 0 202.669s90.923 202.667 202.667 202.667c48.213 0 92.48-16.981 127.317-45.184l145.6 145.6c4.16 4.16 9.621 6.251 15.083 6.251s10.923-2.091 15.083-6.251c8.341-8.341 8.341-21.824-.001-30.165zM202.667 362.669c-88.235 0-160-71.765-160-160s71.765-160 160-160 160 71.765 160 160-71.766 160-160 160z" />
                                        </svg>
                                    </button>
                                    </div>
                                </div>
                            </div>

                            {this.state.searched &&
                                <div className="col" style={{textAlign:'center', padding:'10px'}}>
                                    <div className="col">
                                        <img alt="DP" className="listDP2"src={logo} />
                                    </div>
                                    <div className="col-12" style={{margin:'10px 0px'}}>  
                                    <button className="btn btn-dark" onClick={this.addFriend}>
                                        <label className="friend-list-name">{this.state.searched.displayName}
                                            <svg className="add-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                                <path d="M367.57 256.909a260.207 260.207 0 00-30.093-12.081C370.56 219.996 392 180.455 392 136 392 61.01 330.991 0 256 0S120 61.01 120 136c0 44.504 21.488 84.084 54.633 108.911-30.368 9.998-58.863 25.555-83.803 46.069-45.732 37.617-77.529 90.086-89.532 147.743-3.762 18.066.745 36.622 12.363 50.908C25.222 503.847 42.365 512 60.693 512H307c11.046 0 20-8.954 20-20s-8.954-20-20-20H60.693c-8.538 0-13.689-4.766-15.999-7.606-3.989-4.905-5.533-11.29-4.236-17.519 20.755-99.695 108.691-172.521 210.24-174.977a137.229 137.229 0 0010.656-.002c31.12.73 61.05 7.832 89.044 21.14 9.977 4.74 21.907.499 26.649-9.478 4.742-9.976.5-21.907-9.477-26.649zm-106.692-25.032a260.16 260.16 0 00-9.718.002C200.465 229.35 160 187.312 160 136c0-52.935 43.065-96 96-96s96 43.065 96 96c0 51.299-40.445 93.329-91.122 95.877z" />
                                                <path d="M492 397h-55v-55c0-11.046-8.954-20-20-20s-20 8.954-20 20v55h-55c-11.046 0-20 8.954-20 20s8.954 20 20 20h55v55c0 11.046 8.954 20 20 20s20-8.954 20-20v-55h55c11.046 0 20-8.954 20-20s-8.954-20-20-20z" />
                                            </svg>
                                        </label>
                                    </button>
                                    </div>
                                </div>
                            }

                            {this.state.error &&
                                <div className="col" style={{textAlign:'center', padding:'10px'}}>
                                    <div className="col-12" style={{margin:'10px 0px'}}>  
                                        <p className="message-list-name">{this.state.error}</p>
                                    </div>
                                </div>
                            }

                        </>
                        }


                    </div>
                </div>

                    <div className="col-lg-9 col-md-12" style={{padding:'0px'}}>
                        {(this.state.menu=="Chats" && !this.state.recipient)&&
                            <div className="chat-col" style={{justifyContent:'center'}}>
                                <div style={{textAlign:'center'}}>
                                    <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Chats</h1>
                                    <h2 style={{fontSize:'20px',marginTop:'-25px',fontStyle:'italic'}}>Click a friend to view his Chats</h2>
                                </div>
                            </div>                    
                        }
                        {(this.state.recipient && this.state.menu=="Chats") &&
                            <ChatScreen 
                                length={this.state.occupants.length} 
                                name={this.state.recipient}
                                userid={this.state.user.uid}
                            />        
                        }
                        {this.state.menu=="Status" &&
                            <StoryScreen/>
                        }
                        {this.state.menu=="Add Friends" &&
                            <FriendScreen
                                uid = {this.state.user.uid}
                            />
                        }
                        {this.state.menu=="Settings" &&
                            <SettingScreen uid = {this.state.user.uid} menu={this.state.settingsMenu}/>
                        }
                    </div>
                    
                </div>
                </div>
            );
        }
        else{
            return <></>
        }
    }
}

export default Chats;

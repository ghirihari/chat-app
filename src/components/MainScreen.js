import React from 'react'
import ChatScreen from '../components/ChatScreen'
import StoryScreen from './MapScreen'
import FriendScreen from './FriendScreen'
import SettingScreen from './SettingScreen'
import PostScreen from './PostScreen'
import Logo from './assets/logo.png'; 
import Chat from './assets/chat.png'; 

const RenderScreen = (props) => {
    switch(props.menu){
        case "Chats":
            if(props.recipient){
                return(
                    <ChatScreen 
                        name={props.recipient}
                        userid={props.user.uid}
                        data={props.chatData}
                        unSetRec={props.unSetRec}
                        private={props.private}
                        />
                )   
            }
            else{
                return(
                    <div className="chat-col" style={{justifyContent:'center'}}>
                        <div style={{textAlign:'center'}}>
                            <img src={Chat} alt="Illustration" className="illustration"></img>
                            {/* {/* <h1 className="title_font" style={{color:'black',fontSize:'100px'}}>Chats</h1> */}
                            {/* <h2 className="capt">Click on a friend to chat</h2>  */}
                        </div>
                    </div> 
                );
            }
        case "Friends-Map":
            return (
                <StoryScreen
                    uid = {props.user.uid}
                    unSetMapMode = {props.unSetMapMode}
                />
            )
        case "Add Friends":
            return(
                <FriendScreen uid = {props.user.uid}/>
            )
        case "Posts":
            return <PostScreen
                        name={props.recipient}
                        uid = {props.user.uid}
                        wall = {props.wall}
                        wallData = {props.wallData}
                        unSetWall = {props.unSetWall}
                    />
        case 'Settings':
            return <SettingScreen 
                    uid = {props.user.uid} 
                    menu={props.settingsMenu}
                    unSetSettings={props.unSetSettings}
                    private={props.private}
                    setPrivate={props.setPrivate}
              
                    />
        default:
            return <></>;
    }
}

const MainScreen = (props) => {
    return (
        <div className={props.ChatScreenClass} style={{padding:'0px'}}>
            {props.uploading &&
                <div className="upload">
                    <div><img src={Logo} alt="Loader" className="loader"/></div>
                    <label>Uploading...</label>
                </div>
            }

            <RenderScreen 
                ChatScreenClass = {props.ChatScreenClass}
                menu = {props.menu}
                recipient = {props.recipient}
                user = {props.user}
                chatData = {props.chatData}
                wall = {props.wall}
                wallData = {props.wallData}
                settingsMenu = {props.settingsMenu}
                unSetRec = {props.unSetRec}
                unSetMapMode = {props.unSetMapMode}
                unSetWall = {props.unSetWall}
                unSetSettings = {props.unSetSettings}
                private={props.private}
                setPrivate={props.setPrivate}
          
            />
    </div>
    )
}

export default MainScreen

import React from 'react';
// import logo from './assets/pew.jpg'; 

class SettingsList extends React.Component {

    render(){
        return(
            <div className="col" style={{marginTop:'10px'}}>
                <button className="btn ListButtons whitee shadow" onClick={()=>this.props.setSettings('Edit Profile')}>Edit Profile</button>
                <button className="btn ListButtons whitee shadow" onClick={()=>this.props.setSettings('Change Password')}>Change Password</button>
                <button className="btn btn-danger ListButtons" onClick={this.props.logout}>Logout</button>
            </div>
        )
    }
}

export default SettingsList;

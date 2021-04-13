import React from 'react';
import logo from './assets/pew.jpg'; 

class SettingsList extends React.Component {

    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className="col" style={{marginTop:'10px'}}>
                <div>
                    <button className="btn btn-dark ListButtons">Edit Profile Details</button>
                </div>

                <div>
                    <button className="btn btn-danger ListButtons">Logout</button>
                </div>
            </div>
        )
    }
}

export default SettingsList;

import React from 'react';
import logo from './assets/pew.jpg'; 

class StoriesList extends React.Component {

    constructor(props)
    {
        super(props);
    }
    render(){
        return(
            <div className="col" style={{marginTop:'10px'}}>
                <div>
                    <button style={{width:'100%'}} className="btn btn-dark">Add Status</button>
                </div>

                <div className={"row messages_list_item shadow "}>
                    <div className="col-2" style={{padding:'0px'}}>
                        <img alt="DP" className="listDP"src={logo} />
                    </div>
                    <div className="col-10" style={{alignSelf:'center'}}>
                    <div className="row">
                        <div className="col-12">  
                            <p className="message-list-name">{'Conor McGregor'}</p>
                        </div>
                        <div className="col-4">
                            <div className="time">
                                <p style={{marginBottom:'0px'}}>12:30AM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
    }
}

export default StoriesList;

import React,{useState} from 'react'

const GenKey = (props) => {
    const [Key, setKey] = useState("");

    const genKey = () => {
        console.log(Key)
        fetch("https://garnet-gregarious-robe.glitch.me/genkey?uid="+props.uid+"&pass="+Key)
        .then(response => response.json())
        .then(data => {
            if(data.status===200){
                props.setPrivate(Key);
                props.setKeys()

            }
        });

    }
    
    return (
        <div className="popup form-group">
            <label>Create an Encryption Key</label>
            <input className="form-control pass" type="password" placeholder="Enter Key" value={Key} onChange={(e)=>setKey(e.target.value)}/>
            <small id="usernameHelp" className="form-text text-muted">Should be within 10 characters.</small>
            <div style={{textAlign:'end'}}>
                <button type="submit" className="btn btn-primary" onClick={()=>genKey()}>Submit</button>
            </div>
        </div>
    )
}

const SetKey = (props) => {
    const [Key,setKey] = useState("");
    

    return (
        <div className="popup form-group">
            <label>Enter your Encryption Key</label>
            <input className="form-control pass" type="password" placeholder="Key" value={Key} onChange={(e)=>setKey(e.target.value)} />
            <small id="usernameHelp" className="form-text text-muted">Should be within 10 characters.</small>
            <div style={{textAlign:'end'}}>
                <button type="submit" className="btn btn-danger" onClick={()=>props.setnoKey()}>Cancel</button>
                <button type="submit" style={{marginLeft:'5px'}} className="btn btn-primary" onClick={()=>props.setPrivate(Key)}>Set</button>
            </div>
        </div>
    )
}

export default GenKey



export {GenKey, SetKey}

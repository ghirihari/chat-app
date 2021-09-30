import React, {useState} from 'react'
import Logo from './assets/logo.png'

const Loader = (props) => {
    const [Pin, setPin] = useState('')

    const pinTyped = (e) => {
        setPin(e.target.value);
    }

    return (
        <div className="LoadingPage">
            <div><img src={Logo} className="loader"/></div>
            {(!props.private) &&
                <div className="pinCont">
                    <input className="pin" placeholder="Enter your Pin" value={Pin} onChange={(e)=>pinTyped(e)}/>
                    <button className="pinSubmit" onClick={()=>{props.setPrivate(Pin)}}>
                        <svg style={{fill:"#fff"}}xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 2h-7.229l7.014 7h-13.785v6h13.785l-7.014 7h7.229l10-10z"/></svg>
                    </button>
                </div>
            }
        </div>
    )
}

export default Loader

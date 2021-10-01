import React, {useState} from 'react'
import Logo from './assets/logo.png'

const Loader = (props) => {
    const [Pin, setPin] = useState('')

    const pinTyped = (e) => {
        setPin(e.target.value);
    }

    return (
        <div className="LoadingPage">
            <div><img src={Logo} alt="Loader" className="loader"/></div>
            <h1 className="title_font">Instance.com</h1>
            <div style={{fontFamily:"Roboto Slab"}}>
                <label>
                    <svg xmlns="http://www.w3.org/2000/svg" style={{marginRight:'5px'}} fill="#fff" viewBox="0 0 30 30" width="15px" height="15px">    <path d="M 15 2 C 11.145666 2 8 5.1456661 8 9 L 8 11 L 6 11 C 4.895 11 4 11.895 4 13 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 13 C 26 11.895 25.105 11 24 11 L 22 11 L 22 9 C 22 5.2715823 19.036581 2.2685653 15.355469 2.0722656 A 1.0001 1.0001 0 0 0 15 2 z M 15 4 C 17.773666 4 20 6.2263339 20 9 L 20 11 L 10 11 L 10 9 C 10 6.2263339 12.226334 4 15 4 z"/></svg>
                    End to end encrypted
                </label>
            </div>
            {/* {(!props.private) &&
                <div className="pinCont">
                    <input type="password" className="pin" placeholder="Enter your Pin" value={Pin} onChange={(e)=>pinTyped(e)}/>
                    <button className="pinSubmit" onClick={()=>{props.setPrivate(Pin)}}>
                        <svg style={{fill:"#fff"}}xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M14 2h-7.229l7.014 7h-13.785v6h13.785l-7.014 7h7.229l10-10z"/></svg>
                    </button>
                </div>
            } */}
        </div>
    )
}

export default Loader

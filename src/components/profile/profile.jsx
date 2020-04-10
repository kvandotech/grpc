import React from "react";
import './profile.css'
import headerGo1 from '../../images/1.png'

const Profile = () => {
    return (
        <div className={'wrap d-flex justify-content-between align-items-center'}>

            <div className={'go-to-protobuf'}>
                <h1 className={''}>Go-to-Protobuf</h1>
                <h2 className={''}>Convert Go struct to Protobuf</h2>
            </div>
            <img className={'image'} src={headerGo1} alt={'goland watches'}/>
            <div className={'descriptions'}>
                <p>This tool instantly converts Go type into a Protobuf messages definition. Paste a Go type on the left
                    and the equivalent Protobuf message will be generated to the right, which you can paste into your
                    program. The script has to make some assumptions, so double-check the output!</p>
            </div>

        </div>
    )
};

export default Profile;
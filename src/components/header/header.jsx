import React from "react";
import './header.css'
import {NavLink} from "react-router-dom";
import logo from '../../images/logo.svg'

const Header = () => {
    return (
        <div className={'header'}>

            <img src={logo} alt={'kvando'}/>
            <div className={'nav-nav-link'}>
                <NavLink
                    to={'/'}
                    activeClassName={'active-link'}>
                    Home
                </NavLink>
                <NavLink
                    to={'/doc/'}
                    activeClassName={'active-link'}>
                    Documentation
                </NavLink>
            </div>
        </div>

    )
};

export default Header;
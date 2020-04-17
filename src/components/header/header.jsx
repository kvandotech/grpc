import React from "react";
import './header.css'
import {NavLink} from "react-router-dom";
import logo from '../../images/logo.svg'

const Header = () => {
    return (
        <div className={'header'}>
            <NavLink
                to={'/'}
                activeClassName={'active-link'}>
                <img src={logo} alt={'kvando'}/>
            </NavLink>
            <div className={'nav-nav-link'}>
                <NavLink
                    className={'documentation'}
                    to={'/doc/'}
                    activeClassName={'active-link'}>
                    Documentation
                </NavLink>
            </div>
        </div>

    )
};

export default Header;
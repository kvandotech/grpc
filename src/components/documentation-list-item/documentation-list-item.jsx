import React, {Component} from "react";
import './documentation-list-item.css'
import {NavLink} from "react-router-dom";
import img from '../../images/razrabotka-veb-serverov-na-Golang-ot-prostogo-k-slojnomu.png'

export default class DocumentationListItem extends Component {
    documentationItems = [
        {name: 'struct', label: 'Parse struct'},
        {name: 'rpc', label: 'Parse rpc methods'},
        {name: 'enum', label: 'Parse enum'}
    ];

    render() {
        const {nameActive, onActiveChange} = this.props;
        const documentations = this.documentationItems.map(({name, label}) => {
            const isActive = name === nameActive;
            const classNames = `list-group-item list-group-item-action ${isActive ? 'active' : ''}`;
            return (
                <NavLink to={`${name}`}
                         key={name}
                         className={classNames}
                         onClick={() => onActiveChange(name)}
                         activeClassName={'active-link-item'}>
                    {label}
                </NavLink>
            );
        });
        return (
            <div className={'documentation-list-item'}>
                <div className="list-group list-item">
                    {documentations}
                </div>
                <div>
                    <img src={img} alt={'logo goland'}/>
                </div>
            </div>
        )
    }
};

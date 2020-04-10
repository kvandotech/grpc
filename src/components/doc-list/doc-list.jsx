import React, {Component} from "react";
import './doc-list.css';
import {Redirect} from 'react-router-dom'
import {Route, Switch} from "react-router";
import StructDescription from "../description/struct-description";
import RpcDescription from "../description/rpc-description";
import EnumDescription from "../description/enum-description";

export default class DocList extends Component {

    componentDidMount() {
        const {history} = this.props;
        history.push('/doc/');
    }

    render() {
        return (
            <div className={'doc-list'}>
                <Switch>
                    <Route
                        path={'/doc/'}
                        component={StructDescription}
                        exact/>
                    <Route
                        path={"/doc/struct"}
                        component={StructDescription}
                        exact/>
                    <Route
                        path={"/doc/rpc"}
                        component={RpcDescription}
                        exact/>
                    <Route
                        path={"/doc/enum"}
                        component={EnumDescription}
                        exact/>
                    <Redirect to={'/doc/'}/>
                </Switch>
            </div>
        );
    }
};

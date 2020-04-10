import React from "react";
import './content.css';
import {Redirect, Route, Switch} from "react-router";
import Profile from "../profile";
import Documentation from "../documentation";

const Content = () => {
    return (
        <div className={'content'}>
            <Switch>
                <Route
                    path={"/"}
                    component={Profile}
                    exact/>
                <Route
                    path={"/profile/"}
                    component={Profile}
                    exact/>
                <Route
                    path={"/doc/"}
                    render={({history})=>{
                        return <Documentation history={history}/>
                    }}
                    component={Documentation}/>
                <Redirect to={'/'}/>
            </Switch>
        </div>
    );
};

export default Content
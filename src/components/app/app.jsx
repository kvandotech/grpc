import React, {Component} from 'react';
import './app.css'
import Row from "../row";
import TextAreaInput from "../text-area-input";
import {parserGoStruct} from "../utils/parser/parser-struct-go-to-protobuf";
import TextAreaOutput from "../text-area-output";
import Footer from "../footer/footer";
import Header from "../header";
import {BrowserRouter} from "react-router-dom";
import Content from "../content";
import Favicon from "react-favicon";
import fav from '../../images/fav.svg'

class App extends Component {

    state = {
        term: '',
        isRpc: false,
    };

    onParserChange = (term) => {
        this.setState({term});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState !== this.state) {
            this.parse(this.state.term, this.state.isRpc)
        }
    }

    parse = (term, isRpc) => {
        return parserGoStruct(term, isRpc);
    };

    hasRpcMethods = (event) => {
        debugger;
        const target = event.target;
        this.setState({isRpc: target.checked});
    };

    render() {
        const {term, isRpc} = this.state;
        let protobuf = '';
        if (term) {
            protobuf = this.parse(term, isRpc);
        }
        return (
            <BrowserRouter>
                <Favicon url={fav}/>
                <div className={'app d-flex flex-column'}>
                    <Header/>
                    <Content/>
                    <Row
                        left={<TextAreaInput onParserChange={this.onParserChange}/>}
                        right={<TextAreaOutput
                            protobuf={protobuf}
                            hasRpcMethods={this.hasRpcMethods}/>}/>
                    <Footer/>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;

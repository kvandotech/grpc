import React, {Component} from "react";
import './enum-description.css';

import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/theme/neo.css'
import 'codemirror/mode/go/go.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'

export default class EnumDescription extends Component {
    state = {
        code: `type Message_Humour int32

const (
    Message_UNKNOWN     Message_Humour = 0
    Message_PUNS        Message_Humour = 1
    Message_SLAPSTICK   Message_Humour = 2
    Message_BILL_BAILEY Message_Humour = 3
    Message_HER         Message_Humour = 4
)
var Message_Humour_name = map[int32]string{
    0: "UNKNOWN",
    1: "PUNS",
    2: "SLAPSTICK",
    3: "BILL_BAILEY",
    4: "HER",
}`
    };

    render() {

        return (
            <div className={'struct-description d-flex'}>
                <div className={'struct-description-card rpc'}>
                    <h3>Example of structures using an enumeration</h3>
                    <div className={'struct-description-codemirror'}>
                        <CodeMirror
                            value={this.state.code}
                            options={{
                                mode: 'go',
                                theme: 'neo',
                                lineWrapping: false,
                                scrollbarStyle: 'overlay',
                                extraKeys: {
                                    Enter: (cm) => {
                                        cm.execCommand('newlineAndIndent');
                                        cm.execCommand('defaultTab');
                                    }
                                },
                            }}
                            onBeforeChange={(editor, data, value) => {
                            }}/>
                    </div>

                </div>
                <div className={'struct-description-doc'}>
                    <h3>
                        Description
                    </h3>
                    <div className={'struct-description-doc-container'}>
                        <p>To get the correct conversion result:</p>
                        <ul>
                            <li>To add an enum to a Protobuf structure, it is necessary to <strong>type</strong> a structure tag in which both enum and its title in the format <strong>[name struct]_[name enum]</strong> will fit.</li>
                            <li>With any of these options specify transferring names. Using <strong>const</strong > or <strong>var</strong > as it’s shown in the example.</li>
                            <li>In analyzing this structure was used an automatic program generation with <a href={'https://grpc.io/'}>gRPC</a>.</li>
                        </ul>
                    </div>

                </div>
            </div>
        )
    }
};
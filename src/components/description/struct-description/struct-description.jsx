import React, {Component} from "react";
import './struct-description.css';

import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/theme/neo.css'
import 'codemirror/mode/go/go.js'

export default class StructDescription extends Component {
    state = {
        code: `type Field struct {
\tID string
\tName string
\tNamber int32
\tIsMandatory bool
\tEventFieldItem []*EventFieldItem
}`
};

    render() {
        return (
            <div className={'struct-description d-flex'}>
                <div className={'struct-description-card'}>
                    <h3>Example of structures in Go</h3>
                    <div className={'struct-description-codemirror'}>
                        <CodeMirror
                            value={this.state.code}
                            options={{
                                mode: 'go',
                                theme: 'neo',
                                lineWrapping: false,
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
                            <li>Use indents as it’s shown in the example.</li>
                            <li>If you use any imports, you will have to write them manually. <br/>For example <strong>import "google/protobuf/any.proto";</strong>.</li>
                            <li>Go-to-Protobuf supports all data types except an attached map in the map. In this case, the error is entered directly into the Protobuf structure. <strong>Error: Type not defined. No support for embedded map</strong>.</li>
                            <li>In addition, according to the Protobuf documentation, numbering from 19000 to 19999 will be omitted in the message fields.</li>
                            <li>Before and after the conversion, make sure that the structure is correct, as the service may not work perfectly.</li>
                        </ul>
                    </div>

                </div>
            </div>
        )
    }
};
import React, {Component} from "react";
import './rpc-description.css';

import {Controlled as CodeMirror} from 'react-codemirror2'

import 'codemirror/theme/neo.css'
import 'codemirror/mode/go/go.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'

export default class RpcDescription extends Component {
    state = {
        code: `type ListOpenFilesRequestProto  int32{
\tID string
\tName string
\tNamber int32
}

type ListOpenFilesResponseProto  int32{
}

type GetEditsFromTxidResponseProto int32{
}`
    };

    render() {

        return (
            <div className={'struct-description d-flex'}>
                <div className={'struct-description-card rpc'}>
                    <h3>Example of structures for RPC methods</h3>
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
                            <li>Add a <strong>RequestProto</strong > or <strong>ResponseProto</strong> or <strong>Request</strong > or <strong>Response</strong> to the body of the function name.</li>
                            <li>If one of the parameters won’t be specified in the medot, <strong>google.protobuf.Empty</strong > will be listed instead.</li>
                            <li>The <strong>import "google/protobuf/empty.proto"</strong> will be automatically inserted into the Protobuf structure.</li>
                            <li>Use the <strong>RPC methods</strong> in the editor window to display <strong>RPC</strong> methods in the Protobuf structure</li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
};
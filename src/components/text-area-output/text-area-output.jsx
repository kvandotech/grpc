import React, {Component} from 'react'
import './text-area-output.css'
import {UnControlled as CodeMirror} from 'react-codemirror2'
import '../codemirror/codemirror.css'
import 'codemirror/theme/ayu-mirage.css'
import 'codemirror/mode/protobuf/protobuf.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'

class TextAreaOutput extends Component {

    state = {
        editor: '',
        protobuf: '',
        copied: 'Copied!',
    };

    onBeforeChangeSaveEditor = (editor) => {
        this.setState({editor: editor, copied: false});
    };

    onBeforeChangeSaveProrobuf = (value) => {
        this.setState({protobuf: value});
    };

    onClickSelectAll = (event) => {
        debugger;
        const textArea = document.createElement('textarea');

        const {editor, protobuf} = this.state;

        textArea.innerHTML = protobuf;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        textArea.remove();

        editor.execCommand('selectAll');
        event.target.focus();
    };

    componentDidMount() {
        let {protobuf} = this.props;
        this.setState({protobuf: protobuf});
    }

    componentDidUpdate({protobuf}, prevState, snapshot) {
        if (this.state.protobuf !== protobuf) {
            this.setState({protobuf: protobuf})
        }
    }

    render() {
        let {protobuf = ``, hasRpcMethods} = this.props;

        let placeholder = 'Protobuf will appear here';
        return (
            <div className={'output d-flex flex-column'}>
                <div className={'d-flex justify-content-between'}>
                    <div className={'title'}>
                        {placeholder}
                    </div>
                    <div className={'d-flex group-item'}>
                        <div className="form-check check check-style">
                            <input className="form-check-input"
                                   type="checkbox"
                                   onChange={hasRpcMethods}/>
                            <label className="form-check-label" htmlFor="defaultCheck1">
                                RPC methods
                            </label>
                        </div>

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.onClickSelectAll}>
                            Copy
                        </button>
                    </div>
                </div>

                <CodeMirror
                    value={protobuf}
                    options={{
                        mode: 'protobuf',
                        theme: 'ayu-mirage',
                        readOnly: true,
                        scrollbarStyle: 'overlay',

                    }}
                    onBeforeChange={(editor, data, value) => {
                        debugger;
                        this.onBeforeChangeSaveEditor(editor);
                        this.onBeforeChangeSaveProrobuf(value);

                    }}/>
            </div>
        )
    }
}

export default TextAreaOutput
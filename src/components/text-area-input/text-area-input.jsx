import React, {Component} from 'react'
import './text-area-input.css'
import {Controlled as CodeMirror} from 'react-codemirror2'
import example from "../utils/example";

import '../codemirror/codemirror.css'
import 'codemirror/theme/ayu-dark.css'
import 'codemirror/mode/go/go.js'
import 'codemirror/addon/scroll/simplescrollbars.js'
import 'codemirror/addon/scroll/simplescrollbars.css'
import 'codemirror/addon/edit/closebrackets.js'

export default class TextAreaInput extends Component {
    state = {
        term: example
    };

    onClick = () => {
        this.setState({term: ''});
    };
    onParserChange = (event) => {
        const term = event;
        this.setState({term});
        this.props.onParserChange(term);
    };

    onMouseDownPlaceholder = () => {
        this.setState({isPlaceholder: false});
    };

    render() {
        const {term} = this.state;
        let placeholder = 'Paste Go struct here';

        return (
            <div className={'input d-flex flex-column'}>
                <div className={'d-flex justify-content-between'}>
                    <div className={'title'}>
                        {placeholder}
                    </div>
                    <button
                        type="button"
                        className="btn btn-primary"
                        onClick={this.onClick}>
                        Clear
                    </button>
                </div>
                <CodeMirror
                    value={term}
                    options={{
                        mode: 'go',
                        theme: 'ayu-dark',
                        lineWrapping: false,
                        scrollbarStyle: 'overlay',
                        autoCloseBrackets: true,
                        extraKeys: {
                            Enter: (cm) => {
                                cm.execCommand('newlineAndIndent');
                                cm.execCommand('defaultTab');
                            }
                        },
                    }}
                    onMouseDown={(editor, event) => {
                        this.onMouseDownPlaceholder();
                    }}

                    editorDidMount={(editor, value, cb) => {
                        this.onParserChange(value);
                    }}
                    onBeforeChange={(editor, data, value) => {
                        this.onParserChange(value);
                    }}
                    onChange={(editor, data, value) => {
                        if (value === '') {
                            this.onParserChange(value);
                        }
                    }}/>
            </div>

        )
    }
}
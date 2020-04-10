import React, {Component} from "react";
import './documentation.css';
import DocumentationListItem from "../documentation-list-item";
import DocList from "../doc-list";

export default class Documentation extends Component {
    state = {
        nameActive: '',
    };

    componentDidMount() {
        this.setState({nameActive:'struct'})
    }

    onActiveChange = (name) => {
        this.setState({nameActive: name})
    };

    render() {
        const {nameActive} = this.state;
        const {history} = this.props;
        return (
            <div className={'documentation'}>
                <DocumentationListItem
                    nameActive={nameActive}
                    onActiveChange={this.onActiveChange}/>
                <DocList history={history}/>
            </div>
        )
    }
};
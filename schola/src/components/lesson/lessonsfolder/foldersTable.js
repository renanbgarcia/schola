import React, { Component } from 'react';
import Folder from '../folder';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { _history } from '../../../App';


export default class FoldersTable extends Component {

    addButtons() {
        let elem = '';

        if (this.props.parents.length > 1 && this.props.parents[this.props.parents.length - 1].type === 'discipline') {
            elem = <div className="lessons-folder-item lessons-folder-item-button" onClick={this.props.showCCmodal}>Criar curso</div>
        } else if (this.props.parents.length > 1 && this.props.parents[this.props.parents.length - 1].type === 'category') {
            elem = <div className="lessons-folder-item lessons-folder-item-button" onClick={this.props.showCLmodal}>Criar Lição</div>
        }
        return elem
    }
    

    render() {
        console.log(new Date())
        debugger
        return (
            <>
                {this.addButtons()}
                {
                this.props.actualView.children.map(folder => 
                    <Folder folder={folder}
                            onClick={() => {
                                folder.type === 'lesson'? _history.push(`/lessonpage/${folder.id}`) : this.props.goToFolder(folder)
                            } }/>
                )
                }
            </>
        )
    }
}

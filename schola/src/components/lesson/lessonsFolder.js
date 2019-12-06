import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlus } from '@fortawesome/free-solid-svg-icons';
import Modal from '../utils/modal';
import CreateLesson from '../lesson/CreateLesson';
import CalendarBox from '../utils/calendar/calendarEditBox';

class LessonsFolder extends React.Component {

    constructor(props) {
        super(props);
        this.renderFolders = this.renderFolders.bind(this);
        this.goToFolder = this.goToFolder.bind(this);
        this.addCrumb = this.addCrumb.bind(this);
        this.goBack =this.goBack.bind(this);
        this.removeCrumbs = this.removeCrumbs.bind(this);

        this.modalRef = React.createRef();
    }

    componentWillReceiveProps(next) {
        this.setState({
            actualView: next.data,
            parents: [{title: 'categorias', children: next.data}]
        })
    }

    state = {
        breadcrumbs: [],
        actualView: this.props.data,
        parents: [{title: 'categorias', children: this.props.data}]
    }

    renderFolders() {
        return this.state.actualView.map( folder => 
            <div className="lessons-folder-item" onClick={() => this.goToFolder(folder) } >{folder.title}</div>
        )
    }

    goToFolder(folder) {
        console.log(folder)
        if (folder.hasOwnProperty('children')) {
            this.addCrumb(folder);
            this.setState({
                actualView: folder.children,
                parents: [...this.state.parents, folder]
            });
        }
    }

    renderBreadcrumbs() {
        return (
            <p className="lessons-folder-breadcrumbs">{ this.state.breadcrumbs.map(crumb => `${crumb}/` ) }</p>
        )
    }

    addCrumb(folder) {
        this.setState({
            breadcrumbs: [...this.state.breadcrumbs, folder.title]
        })
    }

    removeCrumbs() {
        const newCrumbs = this.state.breadcrumbs;
        newCrumbs.pop();
        this.setState({
            breadcrumbs: newCrumbs
        })
    }

    goBack() {
        const newView = this.state.parents;
        if (newView.length > 1) {
            newView.pop();
            this.removeCrumbs();
            this.setState({
                actualView: newView[newView.length - 1].children
            });
        }
        console.log(newView)
    }

    render() {
        console.log(this.state.parents)
        return (
            <div className="tree-view-wrapper">

                <div className="lessons-folder-toolbar">
                    <span className="lessons-folder-back-arrow"
                          onClick={this.goBack}>
                            {<FontAwesomeIcon icon={faArrowLeft}/>} Voltar
                    </span>
                    {this.renderBreadcrumbs()}
                    <Modal ref={this.modalRef} Component={CalendarBox}/>
                    <span className="lessons-folder-create" ><FontAwesomeIcon icon={faPlus}/></span>
                </div>
                <div className="lessons-folder-items-wrapper">
                    {this.renderFolders()}
                </div>
                
            </div>
        )
    }
}

export default LessonsFolder;
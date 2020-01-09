import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { alertbox } from '../utils/alert';
import { connect } from 'react-redux';
import { showCreateLessonModal } from '../../actions/modalActions';
import { hideCreateLessonModal } from '../../actions/modalActions';
import { showCreateCourseModal } from '../../actions/modalActions';
import { hideCreateCourseModal } from '../../actions/modalActions';
import Folder from './folder';
import Modal from '../utils/modal';
import CreateLesson from '../lesson/CreateLesson';
import CreateCourses from '../lesson/CreateCourses';

class LessonsFolder extends React.Component {

    constructor(props) {
        super(props);
        this.renderFolders = this.renderFolders.bind(this);
        this.goToFolder = this.goToFolder.bind(this);
        this.addCrumb = this.addCrumb.bind(this);
        this.goBack =this.goBack.bind(this);
        this.removeCrumbs = this.removeCrumbs.bind(this);
        this.search = this.search.bind(this);
        this.goToNextResult = this.goToNextResult.bind(this);
        this.toggleSearchBar = this.toggleSearchBar.bind(this);
    }

    componentWillReceiveProps(next) {

        this.setState({
            actualView: next.data,
            parents: [{title: 'categorias', children: next.data}],
            breadcrumbs: [],
            _breadcrumbs: []
        })

        // const ref = firebase.firestore().collection('lessons').get();
        // const ref = firebase.firestore().collection('courses').get();
        // const ref = firebase.firestore().collection('lessons').where('course_id', 'array-contains', 'jeTHbFK4pJMJk4P8QKbH' ).get();
        // let batch = firebase.firestore().batch()
        // ref.then(snap => {snap.docs.forEach(doc => {
        //     console.log(doc.data())
            // const refs = firebase.firestore().collection('lessons').doc(doc.id);
            // batch.update(refs, { course_id: ["jeTHbFK4pJMJk4P8QKbH"] });
        // })
        // batch.commit().then(console.log('tudo foi atualizado'))
        // }
        // )
    }

    state = {
        breadcrumbs: [],
        _breadcrumbs:[],
        actualView: this.props.data,
        parents: [{title: 'categorias', children: []}],
        showSearchBar: false,
        searchTerm: '',
        actualResults: [],
        resultElemIdx: 0,
        isLoading: true
    }

    componentDidUpdate() {
        localStorage.setItem('folderState', JSON.stringify(this.state));
        if (this.state.isLoading === true) {
            this.setState({isLoading: false})
        }
    }

    UNSAFE_componentWillMount() {
        if (localStorage.getItem('folderState') !== null) {
            this.setState({
                ...JSON.parse(localStorage.getItem('folderState'))
            })
        }
    }

    renderFolders() {
        if (this.state.isLoading === true) {
            return <h2>Loading</h2>
        }

        let foldersArray = [];
        if (this.state.parents.length > 1 && this.state.parents[this.state.parents.length - 1].type === 'discipline') {
            foldersArray.push(
                <div className="lessons-folder-item lessons-folder-item-button" onClick={this.props.showCCmodal}>Criar curso</div>
            )
        } else if (this.state.parents.length > 1 && this.state.parents[this.state.parents.length - 1].type === 'category') {
            foldersArray.push(
                <div className="lessons-folder-item lessons-folder-item-button" onClick={this.props.showCLmodal}>Criar Lição</div>
            )
        }
        this.state.actualView.forEach(folder => 
            foldersArray.push(<Folder folder={folder} onClick={() => this.goToFolder(folder) }/>)
        )

        return foldersArray
    }

    goToFolder(folder) {
        console.log(folder)
        this.removeHighlight();
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
            <div className="lessons-folder-breadcrumbs">{ this.state.breadcrumbs.map(crumb => `${crumb}/` ) }</div>
        )
    }

    renderSearchBar() {
        if (this.state.showSearchBar === true) {
            return (
                <div className="lessons-folder-toolbar-search-row">
                    <input type="text" onChange={(e) => this.setState({searchTerm: e.target.value})}/>
                    <span onClick={this.search}>buscar</span>
                    <span onClick={this.goToNextResult}>next</span>
                </div>
            )
        }
    }

    toggleSearchBar() {
        if (this.state.showSearchBar === true) {
            this.setState({
                showSearchBar: false
            });
            //remove a classe highlited de todos os elementos ao fechar a busca
            const highlighted = document.querySelectorAll('.highlighted');
            for (let el of highlighted) {
                el.classList.remove('highlighted');
            }
        } else {
            this.setState({
                showSearchBar: true
            });
        }
    }

    removeHighlight() {
        this.resetResults();
        const highlighted = document.querySelectorAll('.highlighted');
        for (let el of highlighted) {
            el.classList.remove('highlighted');
        }
    }

    addCrumb(folder) {
        console.log(folder)
        this.setState({
            breadcrumbs: [...this.state.breadcrumbs, folder.title],
            _breadcrumbs: [...this.state._breadcrumbs, folder.name]
        })
    }

    removeCrumbs() {
        const newCrumbs = this.state.breadcrumbs;
        const new_Crumbs = this.state._breadcrumbs;

        newCrumbs.pop();
        new_Crumbs.pop();
        this.setState({
            breadcrumbs: newCrumbs,
            _breadcrumbs: new_Crumbs
        })
    }

    goBack() {
        const newView = this.state.parents;
        console.log(newView)
        this.removeHighlight();
        if (newView.length > 1) {
            newView.pop();
            this.removeCrumbs();
            console.log(newView[newView.length - 1].children)
            this.setState({
                actualView: newView[newView.length - 1].children
            });
        }
    }

    search() {
        /*Remove a classe de destaque dos itens do resultado anterior */
        const highlightedElms = document.querySelectorAll('.highlighted')
        for (let el of highlightedElms) {
            el.classList.remove('highlighted');
        }

        let res = this.state.actualView.filter((item) => {
            console.log(item)
                    const re = new RegExp(this.state.searchTerm, 'i');
                    if (!item.hasOwnProperty('description')) {
                        item.description = "";
                    }
                    if (item.title.search(re) !== -1 || item.description.search(re) !== -1) {
                        return item.id
                    }
                })

        const ids = res.map(item => item.id);
        console.log(ids)
        if (ids.length > 0 && this.state.searchTerm !== '') {
            this.setState({
                actualResults: ids,
                resultElemIdx: 0
            });
            const cont = document.querySelector('.lessons-folder-items-wrapper');
            console.log(document.getElementById(ids[0]));
            const el = document.querySelector(`#item-${ids[0]}`);
            el.classList.add('highlighted')
            cont.scroll(0, el.getBoundingClientRect().top - 200);
        } else {
            alertbox.show('Nada encontrado :(')
        }
    }

    resetResults() {
        this.setState({
            actualResults: [],
            resultElemIdx: 0
        })
    }

    goToNextResult() {
        if (this.state.actualResults.length > 0) {
            const results = this.state.actualResults;
            const prevElidx = this.state.resultElemIdx;
            const nextValue = this.state.resultElemIdx < results.length - 1 ? this.state.resultElemIdx + 1 : 0;
            this.setState({
                resultElemIdx: nextValue
            })
            const cont = document.querySelector('.lessons-folder-items-wrapper');
            const el = document.querySelector(`#item-${results[nextValue]}`);
            const prevEl = document.querySelector(`#item-${results[prevElidx]}`);

            // Destaca resultado atual
            prevEl.classList.remove('highlighted');
            el.classList.add('highlighted');

            cont.scroll(0, el.getBoundingClientRect().top);
        }
    }

    getActualDiscipline() {
        return this.state._breadcrumbs
    }

    render() {
        return (
            <div className="tree-view-wrapper">
                <p>{this.state._breadcrumbs.map(el => <span>{el}</span>)}</p>
                <div className="lessons-folder-toolbar">
                    <span className="lessons-folder-back-arrow"
                          onClick={this.goBack}>
                            {<FontAwesomeIcon icon={faArrowLeft}/>}
                    </span>
                    {this.renderBreadcrumbs()}
                    <span className="lessons-folder-back-arrow"
                            onClick={this.toggleSearchBar}>
                        <FontAwesomeIcon icon={faSearch}/>
                    </span>
                    {this.renderSearchBar()}
                </div>
                <div className="lessons-folder-items-wrapper">
                    {this.renderFolders()}
                </div>
                <Modal isOpen={this.props.isCreateLessonOpen}
                       hideFunc={this.props.hideCLModal}
                       Component={<CreateLesson updateData={this.props.retrieveFoldersData} discipline={this.getActualDiscipline()}/>}/>
                <Modal isOpen={this.props.isCreateCourseOpen}
                       hideFunc={this.props.hideCCModal}
                       Component={<CreateCourses updateData={this.props.retrieveFoldersData}/>}/>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    isCreateLessonOpen: store.modalReducer.isCLOpen,
    isCreateCourseOpen: store.modalReducer.isCCOpen,
})

const mapDispatchToProps = (dispatch) => ({
    showCLmodal: () => dispatch(showCreateLessonModal()),
    showCCmodal: () => dispatch(showCreateCourseModal()),
    hideCLModal: () => dispatch(hideCreateLessonModal()),
    hideCCModal: () => dispatch(hideCreateCourseModal()),
});

export default connect(mapStateToProps, mapDispatchToProps)(LessonsFolder);
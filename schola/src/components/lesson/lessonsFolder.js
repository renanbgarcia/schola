import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faSearch } from '@fortawesome/free-solid-svg-icons';
import { alertbox } from '../utils/alert';
import { connect } from 'react-redux';
import { showCreateLessonModal } from '../../actions/modalActions';
import { hideCreateLessonModal } from '../../actions/modalActions';
import Folder from './folder';

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
                breadcrumbs: []
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
        actualView: this.props.data,
        parents: [{title: 'categorias', children: []}],
        showSearchBar: false,
        searchTerm: '',
        actualResults: [],
        resultElemIdx: 0
    }

    componentDidUpdate() {
        localStorage.setItem('folderState', JSON.stringify(this.state));
    }

    UNSAFE_componentWillMount() {
        if (localStorage.getItem('folderState') !== null) {
            this.setState({
                ...JSON.parse(localStorage.getItem('folderState'))
            })
        }
    }

    renderFolders() {
        return this.state.actualView.map( folder => 
            <Folder folder={folder} onClick={() => this.goToFolder(folder) }/>
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
        console.log(newView)
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
                    const re = new RegExp(this.state.searchTerm, 'i');
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

    render() {
        return (
            <div className="tree-view-wrapper">

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
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    showCLmodal: () => dispatch(showCreateLessonModal()),
    hideCLmodal: () => dispatch(hideCreateLessonModal()),
});

export default connect(null, mapDispatchToProps)(LessonsFolder);
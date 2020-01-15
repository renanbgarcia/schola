import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import FilePreviewer from '../utils/previewers/FilePreviewer';
import axios from 'axios';
import { _history } from '../../App';
import { categories, getMaterias } from '../utils/variables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faWindowClose} from '@fortawesome/free-solid-svg-icons';
import Modal from '../utils/modal';
import EditLesson from '../lesson/editLesson';
import { deleteLesson } from '../lesson/folderPopMenu';

class LessonPage extends React.Component {

    constructor(props) {
        super(props);
        this.getLessonInfo = this.getLessonInfo.bind(this);
        this.renderFiles = this.renderFiles.bind(this);
        this.downloadResource = this.downloadResource.bind(this);
        this.translateCategoryName = this.translateCategoryName.bind(this);
        this.translateDisciplineName = this.translateDisciplineName.bind(this);
        this.showEditLesson = this.showEditLesson.bind(this);
        this.hideEditLesson = this.hideEditLesson.bind(this);
        this.handleOnDeleteLesson = this.handleOnDeleteLesson.bind(this);
        this.handleSubmitModal = this.handleSubmitModal.bind(this);
    }

    state = {
        title: 'Loading',
        description: 'Loading',
        tags: [],
        filesURLs: [],
        isEditLessonOpen: false
    }

    UNSAFE_componentWillMount() {
        this.getLessonInfo();
    }

    getLessonInfo() {
        console.log(this.props.match.params.id)
        try {
        firebase.firestore().collection('lessons').doc(this.props.match.params.id).get().then(doc => {
            console.log(doc.data())
            // axios.get(doc.data().filesURLs[0].url).then(res => console.log(res))
            this.setState({
                title: doc.data().title,
                description: doc.data().desc,
                discipline: doc.data().discipline,
                targetAge: doc.data().targetAge,
                tags: doc.data().tags,
                category: doc.data().category,
                filesURLs: doc.data().filesURLs
            })
        })
        } catch(err) {
            console.log(err)
        }
    }

    downloadResource(file) {
        axios.get(file.url, {responseType: 'blob'}).then(res =>  {
            var link = document.createElement('a')
            link.href = URL.createObjectURL(res.data)
            link.download = file.name
            link.click()
            }
        );
    }

    renderFiles() {
        if (this.state.filesURLs  === undefined) {
            return null;
        } else {
        return <div className="previewer-wrapper">
                    { this.state.filesURLs.map(file => {
                        return <div className="file-wrapper-container">   
                                    <a href={file.url}>
                                        <div className="file-wrapper">
                                            <FilePreviewer files={[file]}/>
                                        </div>
                                    </a>
                                    <button onClick={() => this.downloadResource(file)}>Download</button>
                                    <p className="previewer-filename">{file.name}</p>
                               </div>
                    }) }
                </div>
        }
    }

    translateCategoryName(name) {
        for (let cat of categories) {
            if (cat.name === name) {
                return cat.title;
            }
        }
    }

    translateDisciplineName(name) {
        for (let mat of getMaterias()) {
            if (mat.name === name) {
                return mat.title;
            }
        }
    }

    showEditLesson() {
        this.setState({isEditLessonOpen: true});
    }

    hideEditLesson() {
        this.setState({isEditLessonOpen: false});
    }

    handleOnDeleteLesson() {
        deleteLesson(this.props.match.params.id);
        _history.push('/lessons');
    }

    handleSubmitModal() {
        this.getLessonInfo();
        this.hideEditLesson();
    }

    render() {
        console.log(this.state)
        return (
            <div className="home-container">
                <Modal isOpen={this.state.isEditLessonOpen} hideFunc={this.hideEditLesson} componentName="EditLesson">
                    <EditLesson lessonId={this.props.match.params.id} updateData={this.handleSubmitModal}/>
                </Modal>
                <div className="lesson-container">
                    <div className="lesson-info">
                        <button className="button-secondary float-right-top" onClick={this.showEditLesson}>Editar</button>
                        <button className="button-secondary float-right-top" onClick={this.handleOnDeleteLesson}>Excluir</button>
                        <h3>{ this.state.title } </h3>                                
                        <p>{ this.state.description }</p>
                        <div className="lesson-info-details">
                            <div>
                                <span>{ this.translateDisciplineName(this.state.discipline) }</span>
                                <span>{ this.translateCategoryName(this.state.category) }</span>
                                <span>{ this.state.targetAge } anos</span>

                            </div>
                            <div className="tags-wrapper">
                                {this.state.tags.map(tag => <span className="tag-pill">{tag}</span>)}
                            </div>
                        </div>
                    </div>
                    { this.renderFiles() }
                </div>
            </div>
        )
    }
}

export default LessonPage;
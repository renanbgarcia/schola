import React from 'react';
import firebase from '../../firebase';
import FilePreviewer from '../utils/previewers/FilePreviewer';
import axios from 'axios';
import { categories, getMaterias } from '../utils/variables';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faWindowClose} from '@fortawesome/free-solid-svg-icons';

class LessonPage extends React.Component {

    constructor(props) {
        super(props);
        this.getLessonInfo = this.getLessonInfo.bind(this);
        this.renderFiles = this.renderFiles.bind(this);
        this.downloadResource = this.downloadResource.bind(this);
        this.translateCategoryName = this.translateCategoryName.bind(this);
        this.translateDisciplineName = this.translateDisciplineName.bind(this);
    }

    state = {
        title: 'Loading',
        description: 'Loading',
        tags: [],
        filesURLs: []
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
        if (this.state.filesURLs.length === 0) {
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

    render() {
        console.log(this.state)
        return (
            <div className="home-container">
                <div className="lesson-container">
                    <div className="lesson-info">
                        <h3>{ this.state.title }</h3>
                        <p>{ this.state.description }</p>
                        <div className="lesson-info-details">
                            <div>
                                <span>{ this.translateDisciplineName(this.state.discipline) }</span>
                                <span>{ this.translateCategoryName(this.state.category) }</span>
                                <span>{ this.state.targetAge } anos</span>
                                <FontAwesomeIcon icon={faEdit}/>
                                <FontAwesomeIcon icon={faWindowClose}/>
                            </div>
                            <div>
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
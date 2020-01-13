import React from 'react';
import firebase from '../../firebase';
import PdfPreviewer from '../utils/previewers/pdfPreviewer';
import axios from 'axios';

class LessonPage extends React.Component {

    constructor(props) {
        super(props);
        this.getLessonInfo = this.getLessonInfo.bind(this);
        this.renderFiles = this.renderFiles.bind(this);
    }

    state = {
        title: 'Loading',
        description: 'Loading',
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
                filesURLs: doc.data().filesURLs
            })
        })
        } catch(err) {
            console.log(err)
        }
    }

    renderFiles() {
        if (this.state.filesURLs.length === 0) {
            return null;
        } else {
        return <ul>{ this.state.filesURLs.map(file => {
                        return <div className="previewer-wrapper">
                                <PdfPreviewer src={file.url}/>
                                <li>{file.name}</li>
                               </div>
                    }) }
                </ul>
        }
        
    }

    render() {
        return (
            <div className="home-container">
                <h4>{ this.state.title }</h4>
                <p>{ this.state.description }</p>
                <span>Arquivos: </span>
                { this.renderFiles() }
            </div>
        )
    }
}

export default LessonPage;
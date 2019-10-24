import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { alertbox } from '../utils/alert';

class CreateLesson extends React.Component {

    constructor(props) {
        super(props)
        this.handleFileInput = this.handleFileInput.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        fileList: [],
        titleInput: '',
        ageInput: '',
        disciplineInput: '',
        descriptionInput: ''
    }

    handleFileInput() {
        let fileList = document.getElementById('lesson-file').files;
        console.log(fileList[0]);
        this.setState({
            fileList: this.convertItemsToArray(fileList)
        })
    }

    handleTitleInput(e) {
        this.setState({ titleInput: e.target.value});
        console.log(this.state.titleInput);
    }

    handleAgeInput(e) {
        this.setState({ ageInput: e.target.value});
        console.log(this.state.ageInput);
    }

    handleDisciplineInput(e) {
        this.setState({ disciplineInput: e.currentTarget.value});
        console.log(this.state.disciplineInput);
    }

    handleDescriptionInput(e) {
        this.setState({ descriptionInput: e.target.value});
        console.log(this.state.descriptionInput);
    }

    convertItemsToArray(array) {
        return Array.from(array)
    }

    /**
     * Remove um item da lista de upload
     * @param {*} i 
     */
    deleteListItem(i) {
        let newState = this.state.fileList;
        newState.splice(i, 1);
        this.setState({ fileList: newState});
    }

    /**
     * 
     */
     uploadFiles(id) {
        const self = this;
        let db = firebase.firestore();
        // let docRef = db.collection(`users/${this.props.userObject.uid}/lessons`).doc(id);
        let docRef = db.collection(`lessons`).doc(id);
        for (let file of this.state.fileList) {
            let storageRef = firebase.storage().ref(`${this.props.userObject.uid}/lessons/${id}/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
                let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                //Render a informação no tiem da lista
                document.getElementById(file.name).innerHTML = `Progresso: ${progress}%`;
                // switch (snapshot.state) {
                //   case firebase.storage.TaskState.PAUSED:
                //     console.log('Upload is paused');
                //     break;
                //   case firebase.storage.TaskState.RUNNING:
                //     console.log('Upload is running');
                //     break;
                // }
            }, function(error) {
                console.log("Ocorreu um erro: " + error);
                alertbox.show('Ocorreu um erro :(')
                throw error;
            }, function() {
            uploadTask.snapshot.ref.getDownloadURL()
                .then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    let updatedArray = firebase.firestore.FieldValue.arrayUnion(downloadURL)
                    docRef.update({
                        filesURLs: updatedArray
                    })
                    self.deleteListItem();
                });
            });
        }
    }

    /**
     * Insere no banco as informações da lesson, incluindo urls dos arquivos
     * @param {[uploadTask]} urls 
     */
    sendLessonInfo() {
        try {
            let db = firebase.firestore();
            let docRef = db.collection(`lessons`).doc();
            let docID = docRef.id;
    
            docRef.set({
                lessonId: docID,
                title: this.state.titleInput,
                targetAge: this.state.ageInput,
                discipline: this.state.disciplineInput,
                desc: this.state.descriptionInput,
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
                author: this.props.userObject.displayName,
                author_id: this.props.userObject.uid,
                authorProto: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png'
            });
            return docID
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
        }
    }

    //era para renderizar o progesso do upload no component - não está sendo usado
    renderProgress(id, progress) {
        document.getElementById(id).innerHTML = `Completado: ${progress}`;
    }

    handleSubmit() {
        if (this.state.titleInput &&
            this.state.ageInput &&
            this.state.disciplineInput &&
            this.state.descriptionInput !== '') {
            try {
                // for (let i = 0; i < 30 ; i++ ) {
                //     this.sendLessonInfo(i);
                // }
                let lessonID = this.sendLessonInfo();
                this.uploadFiles(lessonID);

            } catch(err) {
                console.log(err);
            }
            alertbox.show('Lição cadastrada!');
        } else {
            alertbox.show('Preencha todos os campos corretamente.')
        }
    }

    // componentWillMount() {
    //     let storageRef = firebase.storage().ref(`${this.props.userObject.uid}/lessons`);
    //     storageRef.listAll().then(function(res) {
    //         res.items.forEach(function(itemRef) {
    //             itemRef.getDownloadURL().then(url => console.log(url));
    //           });
    //     })
    // }

    render() {
        return (
            <div>
                <div className="row row-center">
                    <h3>Create lesson</h3>
                </div>
                <label for="titulo">Título</label>
                <input onChange={e => this.handleTitleInput(e)}
                        type="text"
                        name="titulo"
                        id="title"/>
                <div className="row">
                    <div className="column column-25 mobile-full-width">
                        <label for="idade">Idade alvo</label>
                        <input onChange={e => this.handleAgeInput(e)}
                                type="number"
                                name="idade"
                                id="age"
                                min="0"
                                max="18"/>
                    </div>
                    <div className="column column-75 mobile-full-width">
                        <label for="titulo">Disciplina</label>
                        <select onChange={(e) => this.handleDisciplineInput(e)}id="discipline">
                            <option value="math">Matemática</option>
                            <option value="grammar">Gramática</option>
                            <option value="english">Inglês</option>
                        </select>
                    </div>
                </div>
                <textarea onChange={e => this.handleDescriptionInput(e)}
                            id="description"
                            name="description"
                            defaultValue="Descreva o material">
                </textarea>
                <div className="row row-center">
                    <label className="input-file-label" for="lesson-file">Carregar arquivos</label>
                    <input onChange={this.handleFileInput}
                            type="file"
                            id="lesson-file"
                            multiple/>
                </div>
                <div className="row row-center">
                    <ul className="file-list">
                        {this.state.fileList.map((item, i) =>
                                <li className="file-list-item">
                                    {item.name}
                                    <span id={item.name}></span>
                                    <span onClick={(i) => this.deleteListItem(i)} >
                                        <FontAwesomeIcon className="delete-button-list" icon={faTimesCircle}/>
                                    </span>
                                </li>
                            )}
                    </ul>
                </div>
                <div>
                    <button onClick={this.handleSubmit}>Enviar</button>
                </div>
            </div>
        )
     }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.currentUser,
    userObject: store.authReducer.user,
    isLogged: store.authReducer.isLogged
  });

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateLesson)
import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../../firebase';
import { connect } from 'react-redux'; 

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class CreateLesson extends React.Component {

    constructor(props) {
        super(props)
        this.handleFileInput = this.handleFileInput.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.renderProgress = this.renderProgress.bind(this);
    }

    state = {
        fileList: []
    }

    handleFileInput() {
        let fileList = document.getElementById('lesson-file').files;
        console.log(fileList[0]);
        this.setState({
            fileList: this.convertItemsToArray(fileList)
        })
    }

    handleFormInput() {
        
    }

    convertItemsToArray(array) {
        return Array.from(array)
    }

    deleteListItem(i) {
        let newState = this.state.fileList;
        newState.splice(i, 1);
        this.setState({ fileList: newState});
    }

    uploadFiles() {
        for (let file of this.state.fileList) {
            let storageRef = firebase.storage().ref(`${this.props.userObject.uid}/lessons/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
                let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                //Render a informação no tiem da lista
                document.getElementById(file.name).innerHTML = `Progresso: ${progress}%`;
                switch (snapshot.state) {
                  case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                  case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
                }
            }, function(error) {
            console.log("Ocorreu um erro: " + error);
            }, function() {
            uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                console.log('File available at', downloadURL);
            });
            });
        }
    }

    renderProgress(id, progress) {
        document.getElementById(id).innerHTML = `Completado: ${progress}`;
    }

    componentWillMount() {
        let storageRef = firebase.storage().ref(`${this.props.userObject.uid}/lessons`);
        storageRef.listAll().then(function(res) {
            res.items.forEach(function(itemRef) {
                itemRef.getDownloadURL().then(url => console.log(url));
              });
        })
    }

    render() {
        console.log(this.state.fileList);
        console.log(this.props);
        return (
            <div>
                <div className="row row-center">
                    <h3>Create lesson</h3>
                </div>
                <label for="titulo">Título</label>
                <input type="text" name="titulo" id="titulo"/>
                <div className="row row-center">
                    <div className="column column-25">
                        <label for="idade">Idade alvo</label>
                        <input type="number" name="idade" id="idade" min="0" max="18"/>
                    </div>
                    <div className="column column-75">
                        <label for="titulo">Disciplina</label>
                        <select>
                            <option>Matemática</option>
                            <option>Gramática</option>
                            <option>Inglês</option>
                        </select>
                    </div>
                </div>
                <textarea id="description" name="description">
                    Descreva o material
                </textarea>
                <div className="row row-center">
                    <label className="input-file-label" for="lesson-file">Carregar arquivos</label>
                    <input onChange={this.handleFileInput} type="file" id="lesson-file" multiple/>
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
                    <button onClick={this.uploadFiles}>Enviar</button>
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
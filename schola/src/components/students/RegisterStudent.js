import React from 'react';
import firebase from '../../firebase';
import { alertbox } from '../utils/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt } from '@fortawesome/free-solid-svg-icons'

import { connect } from 'react-redux'

class RegisterStudent extends React.Component {

    constructor(props) {
        super(props);
        this.handleNameInput = this.handleNameInput.bind(this);
        this.handleBirthInput = this.handleBirthInput.bind(this);
        this.handlePhotoInput = this.handlePhotoInput.bind(this);
        this.previewFile = this.previewFile.bind(this);
        this.registerStudents = this.registerStudents.bind(this);
    }

    state =   { 
        styleModal: {
            left: this.props.left,
            transform: 'scale(0)',
        },
        nameInput: '',
        birthInput: '',
        profilePhoto: false,
        turmaInput: ''
    }

    componentWillReceiveProps(nprops) {
        this.setState({
            styleModal: {
                left: nprops.left,
                top: nprops.top,
                transform: nprops.transform
            }
        })
    }

    componentDidUpdate() {
        this.previewFile();
    }

    handleNameInput(e) {
        this.setState({
            nameInput: e.target.value
        })
    }

    handleBirthInput(e) {
        this.setState({
            birthInput: e.target.value
        })
    }

    handleTurmaInput(e) {
        console.log(e.target.value)
        this.setState({
            turmaInput: e.target.value
        })
    }

    handlePhotoInput() {
        let file = document.getElementById('profile-photo-file').files[0];
        console.log(file)
        this.setState({
            profilePhoto: file
        })
    }

    previewFile() {
        var preview = document.querySelector('#upload-photo-preview');
        var file    = this.state.profilePhoto;
        var reader  = new FileReader();
    
        reader.onloadend = function () {
          preview.src = reader.result;
          console.log(reader.result)
        }
      
        if (file) {
          reader.readAsDataURL(file);
        } else {
          preview.src = "";
        }
    }

    registerStudents() {
        if (this.state.birthInput === '' || this.state.nameInput === '') {
            alertbox.show("Preencha os campos corretamente")
            return
        }

        try {
            let db = firebase.firestore();
            let docRef = db.collection(`students`).doc();
            let docID = docRef.id;
    
            docRef.set({
                studentId: docID,
                photo: "https://media.istockphoto.com/vectors/cartoon-animal-head-icon-cat-face-avatar-for-profile-of-vector-id542307016",
                name: this.state.nameInput,
                birthDate: this.state.birthInput,
                turma: this.state.turmaInput,
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
            });
            alertbox.show("Registrado!");
            this.props.resetList();

            this.setState({
                nameInput: '',
                birthInput: ''
            })

            this.uploadFiles(docID);

            return docID
        } catch(err) {
            console.log(err)
            return err
        }

    }

    uploadFiles(id) {
        let db = firebase.firestore();
        let docRef = db.collection(`students`).doc(id);
        let file = this.state.profilePhoto;
            let storageRef = firebase.storage().ref(`${this.props.userObject.uid}/students/${id}/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
                let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                console.log(progress)
            }, function(error) {
                console.log("Ocorreu um erro: " + error);
                alertbox.show('Ocorreu um erro :(')
                throw error;
            }, function() {
            uploadTask.snapshot.ref.getDownloadURL()
                .then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    docRef.update({
                        photo: downloadURL
                    })
                });
            });
    }

    render() {
        console.log(this.state.nameInput, this.state.birthInput)
        return (
            <div style={this.state.styleModal} className="register-student-modal">
                <form>
                    <label>Nome:
                        <input onChange={(e) => this.handleNameInput(e)} type="text" required/>
                    </label>
                    <label>Nascimento:
                        <input onChange={(e) => this.handleBirthInput(e)} type="date" required/>
                    </label>
                    <label>Turma:
                        <input onChange={(e) => this.handleTurmaInput(e)} type="text" required/>
                    </label>
                    <div className="row-nowrap">
                        <div className="photo-profile-wrapper">
                            <img id="upload-photo-preview" src=""/>
                        </div>
                        <div className="file-label-wrapper">
                            <label className="profile-pic-file-label">
                                <FontAwesomeIcon icon={faCloudUploadAlt} style={{height: "100%", width: "30px", marginRight: "10px"}}/>
                                { this.state.profilePhoto ? <span>{this.state.profilePhoto.name}</span> : "Carregue uma foto de perfil" }
                                <input id="profile-photo-file" onChange={this.handlePhotoInput} type="file"/>
                            </label>
                        </div>
                    </div>
                </form>
                <button onClick={this.registerStudents} className="full-width">Cadastrar</button>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user,
  });

export default connect(mapStateToProps)(RegisterStudent);
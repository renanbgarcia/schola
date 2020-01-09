import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';

import { updateUser } from '../../actions/authAction';
import { alertbox } from '../utils/alert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faWrench, faCheckSquare, faWindowClose } from '@fortawesome/free-solid-svg-icons';

class Profile extends React.Component {

    constructor(props) {
        super(props);
        this.toggleNameEdit = this.toggleNameEdit.bind(this);
        this.handleNameEditClick = this.handleNameEditClick.bind(this);
        this.handleNameEditConfirmClick = this.handleNameEditConfirmClick.bind(this);
        this.handleNameEditInput = this.handleNameEditInput.bind(this);
        this.handleChangePic = this.handleChangePic.bind(this);
        this.uploadPhoto = this.uploadPhoto.bind(this);
        this.handleNameEditCancelClick = this.handleNameEditCancelClick.bind(this);
    }

    state = {
        userPhoto: '',
        showNameEdit: false,
        nameEditInput: '',
        photoFile: '',
    }

    UNSAFE_componentWillMount() {
        if (this.props.user.photoURL) {
            this.setState({
                userPhoto: this.props.user.photoURL
            })
        }
        // else {
        //     const ref = firebase.firestore().collection('users').doc(this.props.user.uid).get();
        //     ref.then(doc => {
        //         this.setState({ userPhoto: doc.data().photoURL });
        //     })
        // }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({
            userPhoto: nextProps.user.photoURL
        })
    }

    handleChangePic(e) {
        this.uploadPhoto(this.props.user.uid, e.currentTarget.files[0])
    }

    uploadPhoto(id, file) {
        const self = this;
        let db = firebase.firestore();
        let docRef = db.collection(`users`).doc(id);
        let storageRef = firebase.storage().ref(`${this.props.user.uid}/profilePic/${file.name}`);
        let uploadTask = storageRef.put(file);
        uploadTask.on('state_changed', function(snapshot){
            let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            console.log(progress);
        }, function(error) {
            console.log("Ocorreu um erro: " + error);
            alertbox.show('Ocorreu um erro :(')
        }, function() {
        uploadTask.snapshot.ref.getDownloadURL()
            .then(function(downloadURL) {
                console.log('File available at', downloadURL);

                //atualiza o user com a url da foto
                docRef.update({
                    photoURL: downloadURL
                })
                let newUser = Object.assign({}, self.props.user, {photoURL: downloadURL});
                console.log(newUser, self.state)
                self.props.updateUser(newUser);

                //atualiza as lições do user pra que use a nova foto
                try {
                db.collection('lessons')
                .where('author_id', '==', self.props.user.uid)
                .get()
                .then(snap => {
                    if (snap.size > 0) {
                        snap.docs.map(doc => {
                            console.log(doc.data())
                            db.collection('lessons').doc(doc.data().lessonId).update({ authorPhoto: downloadURL});
                        })
                    } else {
                        console.log('No lessons to update')
                    }
                })
                } catch (err) {
                    console.log(err);
                }
            });
        });
    }

    handleNameEditInput(e) {
        this.setState({
            nameEditInput: e.target.value
        })
    }

    handleNameEditClick() {
        this.setState({
            showNameEdit: true
        })
    }

    handleNameEditCancelClick() {
        this.setState({
            showNameEdit: false
        })
    }

    handleNameEditConfirmClick() {
        try {
            firebase.firestore()
                    .collection('users')
                    .doc(this.props.user.uid)
                    .update({ displayName: this.state.nameEditInput});
            console.log(this.props)
            let newUser = this.props.user;
            newUser.displayName = this.state.nameEditInput
            this.props.updateUser(newUser)
        } catch(err) {
            console.log(err)
        }
        this.setState({
            showNameEdit: false
        })
    }

    toggleNameEdit() {
        console.log(this.props)
        if (this.state.showNameEdit === false) {
            return <>
                    <div className="user-name-title"> { this.props.user.displayName } </div>
                    <FontAwesomeIcon onClick={this.handleNameEditClick} icon={faEdit} size="1x"/>
                   </>
        } else {
            return <div className="name-edit-input-wrapper">
                    <input type="text" minLength="2" maxLength="18" onChange={(e) => this.handleNameEditInput(e)}/>
                    <FontAwesomeIcon onClick={this.handleNameEditConfirmClick} icon={faCheckSquare} size="2x"/>
                    <FontAwesomeIcon onClick={this.handleNameEditCancelClick} icon={faWindowClose} size="2x"/>
                   </div>
        }
    }

    render() {
        console.log(this.props)
        return (
            <div className="home-container">
                <div className="user-photo-wrapper-wrapper">
                    <div className="user-photo-wrapper">
                        <img className="user-photo" alt="profile picture" src={this.state.userPhoto}/>
                    </div>
                    <label for="photoInput" className="change-photo-icon">
                        <FontAwesomeIcon  icon={faWrench} size="2x"/>
                    </label>
                    <input type="file" id="photoInput" onChange={(e) => this.handleChangePic(e)}/>
                </div>
                <div className="user-name-wrapper">
                    { this.toggleNameEdit() }
                </div>
                <div>
                    <p>Estrelas: </p>
                    <p>Cursos:</p>
                    <p>Lições:</p>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.user
})

const mapDispatchToProps = (dispatch) => ({
    updateUser: (updatedUser) => dispatch(updateUser(updatedUser))
})

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faWrench } from '@fortawesome/free-solid-svg-icons';

class Profile extends React.Component {

    state = {
        userPhoto: ''
    }

    UNSAFE_componentWillMount() {
        if (localStorage.getItem('userPhoto') !== null) {
            this.setState({
                userPhoto: localStorage.getItem('userPhoto')
            })
        } else {
            const ref = firebase.firestore().collection('users').doc(this.props.user.uid).get();
            ref.then(doc => {
                this.setState({ userPhoto: doc.data().photoURL });
                localStorage.setItem('userPhoto', doc.data().photoURL)
            })
        }

    }

    render() {
        return (
            <div className="home-container">
                <div className="user-photo-wrapper-wrapper">
                    <div className="user-photo-wrapper">
                        <img className="user-photo" alt="profile picture" src={this.state.userPhoto}/>
                    </div>
                    <FontAwesomeIcon className="change-photo-icon" icon={faWrench} size="2x"/>
                </div>
                <div className="user-name-wrapper">
                    <div className="user-name-title"> { this.props.user.displayName } </div>
                    <FontAwesomeIcon icon={faEdit} size="1x"/>
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

export default connect(mapStateToProps)(Profile)
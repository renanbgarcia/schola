import React from 'react';
import { Link } from 'react-router-dom';
import { userSignedIn } from '../actions/authAction';
import { connect } from 'react-redux'; 
import axios from 'axios';
import firebase from '../firebase';
import config from '../appConfig';

import './utils/alert.css';
import { alertbox } from './utils/alert';

class Signup extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        emailInput: '',
        passInput: '',
        nameInput: ''
    }

    handleEmailInput(e) {
        this.setState({emailInput: e.target.value});
    }

    handlePassInput(e) {
        this.setState({passInput: e.target.value});
    }

    handleNameInput(e) {
        this.setState({nameInput: e.target.value});
    }

    handleSubmit() {
        if (this.state.nameInput &&
            this.state.emailInput &&
            this.state.passInput !== '') {
            firebase.auth().createUserWithEmailAndPassword(this.state.emailInput, this.state.passInput)
            .then((res) => {
                console.log(res)
                let db = firebase.firestore();
                let docRef = db.collection('users').doc(res.user.uid);
                docRef.set({
                  uid: res.user.uid,
                  displayName: this.state.nameInput,
                  email: this.state.emailInput,
                  photoURL: 'http://4.bp.blogspot.com/-7vZF8swhwNs/U9-regTYTbI/AAAAAAAAAEs/PTca5aWvIFQ/s1600/pattern.jpg'
                });
                this.props.history.push('/login');
                alertbox.show("Usuário criado!");
            })
            .catch((error) => {
                console.log(error);
                alertbox.show('Ocorreu um erro');
                });
        } else {
            alertbox.show('Preencha todos os campos!');
        }
    }

    render() {

        return (
            <div className="row row-center">
                <div className="row row-center">
                    <form className="login-form">
                        <label for="user-name">
                            Nome: 
                        </label>
                        <input onChange={(e) => this.handleNameInput(e)} type="text" id="user-name"/>
                        <label for="user-email">
                            E-mail: 
                        </label>
                        <input onChange={(e) => this.handleEmailInput(e)} type="text" id="user-email"/>
                        <label for="user-password">
                            Senha: 
                        </label>
                        <input onChange={(e) => this.handlePassInput(e)} type="text" id="user-password"/>
                    </form>
                </div>
                <div className="row row-center">
                    <button onClick={this.handleSubmit} className="pure-button button-primary">Cadastrar</button>
                </div>
                <div className="row row-center">
                   <p>Já é membro? <Link to="/login"> FAÇA LOGIN</Link></p>
                </div>
            </div>
        )
     }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.user,
    isLogged: store.authReducer.isLogged
  });
  
const mapDispatchToProps = dispatch => ({
    signIn: (user) => dispatch(userSignedIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
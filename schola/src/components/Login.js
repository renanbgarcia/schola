import React from 'react';
import { Link } from 'react-router-dom';
import firebase from '../firebase';
import { userSignedIn } from '../actions/authAction';
import { connect } from 'react-redux'; 
import { alertbox } from './utils/alert';

class Login extends React.Component {

    constructor(props) {
        super(props)
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        emailInput: '',
        passInput: ''
    }

    handleEmailInput(e) {
        this.setState({emailInput: e.target.value});
    }

    handlePassInput(e) {
        this.setState({passInput: e.target.value});
    }

    handleSubmit() {
        firebase.auth().signInWithEmailAndPassword(this.state.emailInput, this.state.passInput)
        .catch(err => {
            console.log(err);
            alertbox.show(err.message);
            throw err
        }) 
        .then((res) => {
            console.log(res);
            alertbox.show('Logado!');
            firebase.auth().onAuthStateChanged(user => {
            this.props.signIn(user);
          });
        });
    }

    render() {

        return (
            <div className="row row-center">
                <div className="row row-center">
                    <form className="login-form">
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
                    <button onClick={this.handleSubmit} className="pure-button button-primary">Entrar</button>
                </div>
                <div className="row row-center">
                   <p>Ainda não é membro? <Link to="/signup"> CADASTRE-SE</Link></p>
                </div>
            </div>
        )
     }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.currentUser,
    isLogged: store.authReducer.isLogged
  });
  
  const mapDispatchToProps = dispatch => ({
    signIn: (user) => dispatch(userSignedIn(user))
  })

export default connect(mapStateToProps, mapDispatchToProps)(Login)
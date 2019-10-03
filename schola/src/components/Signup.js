import React from 'react';
import { Link } from 'react-router-dom';
import { userSignedIn } from '../actions/authAction';
import { connect } from 'react-redux'; 
import axios from 'axios';
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
        axios.post(`${config.API_URL}/signup`, {
            email: this.state.emailInput,
            password: this.passInput,
            displayName: this.state.nameInput
        })
        .then(res => {
            if (res.status === 200) {
                alertbox.show('Usuário criado!')
                this.props.history.push('/login');
            }
        })
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
    user: store.authReducer.currentUser,
    isLogged: store.authReducer.isLogged
  });
  
const mapDispatchToProps = dispatch => ({
signIn: (user) => dispatch(userSignedIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Signup)
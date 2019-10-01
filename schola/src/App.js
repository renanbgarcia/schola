import React from 'react';
import axios from 'axios';

import './App.css';
import { getUser } from './actions/actions';
import { userSignedIn } from './actions/authAction';
import { connect } from 'react-redux';

import firebase from './firebase';

class App extends React.Component {
  constructor(props) {
    super(props);
    // Não chame this.setState() aqui!
    this.handleSignIn = this.handleSignIn.bind(this);
  }

  handleSignUp() {
    axios.post('http://localhost:3000/signup', {
      email: 'ada@test.com',
      password: '123456',
      displayName: "Joninha"
    });
  }

  handleSignIn() {
    // axios.post('http://localhost:3000/signin', {email: 'jonas@test.com', password: '123456' });
    console.log(this.props);
    firebase.auth().signInWithEmailAndPassword('ada@test.com', '123456')
    .then((res) => {
      console.log(this.props);
      firebase.auth().onAuthStateChanged(user => {
        this.props.signIn(user);
      })
    })
  }

  testeDB() {
    axios.post('http://localhost:3000/savedata');
  }

  render() {
    const { nomedouser, user } = this.props;
    console.log(user);

    return (
      <div className="App">
        <button onClick={this.handleSignUp}>SignUp</button>
        <button onClick={this.handleSignIn}>HandleSignIn</button>
        <button onClick={this.testeDB}>DB</button>
        <h4>{nomedouser}</h4>
        <h4>{user}</h4>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  nomedouser: store.getUser.currentUser,
  user: store.authReducer.currentUser
});

const mapDispatchToProps = dispatch => ({
  getUserName: name => dispatch(getUser(name)),
  signIn: (user) => dispatch(userSignedIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

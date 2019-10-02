import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import './App.css';
import { getUser } from './actions/actions';
import { userSignedIn } from './actions/authAction';
import { connect } from 'react-redux';

import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';



import firebase from './firebase';

class App extends React.Component {
  constructor(props) {
    super(props);
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
    const { nomedouser, user, isLogged } = this.props;

    return (
      <div className="App">
        <Router>
          <Navbar/>
          <div className="Content">
            <button><Link to='/login'>Login</Link></button>
            <button><Link to='/signup'>Signup</Link></button>
            <Route path='/login' component={Login}/>
            <Route path='/signup' component={Signup}/>
          </div>
        </Router>
        {/* <button onClick={this.handleSignUp}>SignUp</button>
        <button onClick={this.handleSignIn}>HandleSignIn</button>
        <button onClick={this.testeDB}>DB</button> */}

        {/* <h4>{nomedouser}</h4>
        <h4>{user} is {isLogged ? 'logged' : 'not logged'}</h4> */}

      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  nomedouser: store.getUser.currentUser,
  user: store.authReducer.currentUser,
  isLogged: store.authReducer.isLogged
});

const mapDispatchToProps = dispatch => ({
  getUserName: name => dispatch(getUser(name)),
  signIn: (user) => dispatch(userSignedIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

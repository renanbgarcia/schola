import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

import './App.css';
import { getUser } from './actions/actions';
import { userSignedIn } from './actions/authAction';
import { connect } from 'react-redux';

import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import CreateLesson from './components/lesson/CreateLesson';

let history = createBrowserHistory()

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  testeDB() {
    axios.post('http://localhost:3000/savedata');
  }

  render() {
    //const { } = this.props;

    return (
      <div className="App">
        <Router history={history}>
          <Navbar/>
          <div className="Content container">
            <Route path='/login' component={Login}/>
            <Route path='/signup' component={Signup}/>
            <Route path='/create/lesson' component={CreateLesson}/>
          </div>
        </Router>
        <div id="alert-area" className="alert-area"></div>
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

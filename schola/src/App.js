import React from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { createBrowserHistory } from 'history';

import './App.css';
import { userSignedIn } from './actions/authAction';
import { connect } from 'react-redux';

// import Home from './components/home/Home';
import Home from './components/home/Home';
import Sidebar from './components/utils/Sidebar';
import SidebarFixed from './components/utils/SidebarFixed';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/Navbar';
import CreateLesson from './components/lesson/CreateLesson';
import Lessons from './components/lesson/Lessons';
import Students from './components/students/Students';
import RegisterStudent from './components/students/RegisterStudent';

let history = createBrowserHistory()

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  testeDB() {
    axios.post('http://localhost:3000/savedata');
  }

  guard() {
    if (this.props.isLogged === true) {
      return Home
    } else {
      return Login
    }
  }

  renderSidebar() {
    console.log(history.location)
    if (this.props.isLogged === false) {
      return null
    } else {
      return <Sidebar/>
    }
  }

  render() {
    return (
      <div className="App" id="app">
        <Router history={history}>
          <Navbar/>

          <div className="Content container">
            <SidebarFixed/>
            {this.renderSidebar()}
            <Route exact path='/' component={this.guard()}/>
            <Route path='/login' component={this.guard()}/>
            <Route path='/signup' component={Signup}/>
            <Route path='/create/lesson' component={CreateLesson}/>
            <Route path='/lessons' component={Lessons}/>
            <Route path='/students' component={Students}/>
            <Route path='/registerstudent' component={RegisterStudent}/>
          </div>
        </Router>
        <div id="alert-area" className="alert-area"></div>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  user: store.authReducer.currentUser,
  isLogged: store.authReducer.isLogged
});

const mapDispatchToProps = dispatch => ({
  signIn: (user) => dispatch(userSignedIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

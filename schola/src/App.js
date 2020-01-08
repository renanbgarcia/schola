import React from 'react';
import axios from 'axios';
import firebase from './firebase';
import { BrowserRouter as Router, Route } from "react-router-dom";
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
// import EditLesson from './components/lesson/editLesson';
// import EditCourse from './components/lesson/editCourse';
import Lessons from './components/lesson/Lessons';
import Profile from './components/profile/Profile';
import Students from './components/students/Students';
import RegisterStudent from './components/students/RegisterStudent';

let history = createBrowserHistory()

class App extends React.Component {

  UNSAFE_componentWillMount() {
    firebase.auth().onAuthStateChanged((res) => {
      localStorage.clear();
    })
  }

  guard() {
    if (this.props.isLogged === false || this.props.user === undefined) {
      return Login
    } else {
      return Home
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
            {/* <SidebarFixed/> */}
            {this.renderSidebar()}
            <Route exact path='/' component={this.guard()}/>
            <Route path='/login' component={this.guard()}/>
            <Route path='/signup' component={Signup}/>
            <Route path='/create/lesson' component={CreateLesson}/>
            {/* <Route path='/edit/lesson/:id' component={EditLesson}/>
            <Route path='/edit/course/:id' component={EditCourse}/> */}
            <Route path='/lessons' component={Lessons}/>
            <Route path='/profile' component={Profile}/>
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
  user: store.authReducer.user,
  isLogged: store.authReducer.isLogged
});

const mapDispatchToProps = dispatch => ({
  signIn: (user) => dispatch(userSignedIn(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

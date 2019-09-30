import React from 'react';
import axios from 'axios';
import logo from './logo.svg';

import './App.css';
import { getUser } from './actions/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class App extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this.props = props;
  // }

  // handleSignUp() {
  //   axios.post('http://localhost:3000/signup', {email: 'jonas@test.com', password: '123456' });
  // }

  // handleSignIn() {
  //   axios.post('http://localhost:3000/signin', {email: 'jonas@test.com', password: '123456' });
  // }

  teste(store) {
    store.dispatch(getUser("Elias doidao"));
    console.log(store.getState());
  }

  render() {
    const { nomedouser } = this.props;
    console.log(nomedouser)

    return (
      <div className="App">
        <button onClick={this.handleSignUp}>SignUp</button>
        <button onClick={this.handleSignIn}>SignIn</button>
        <button onClick={this.teste}>Teste</button>
        <h4>{nomedouser}</h4>
      </div>
    );
  }
}

const mapStateToProps = store => ({
  nomedouser: store.userState.nome
});

// const mapDispatchToProps = dispatch =>
//   bindActionCreators({ getUser }, dispatch);

export default connect(mapStateToProps/*, mapDispatchToProps*/)(App);

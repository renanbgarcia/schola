import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import firebase from '../firebase';

import { userSignedOut } from '../actions/authAction';

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.doLogout = this.doLogout.bind(this);
    }

    doLogout() {
        firebase.auth().signOut().then(() => {
            this.props.signOut();
        });
    }

    render() {

        const { isLogged, user } = this.props;
        console.log(user)

        return (
            <nav>
                <div className="nav-wrapper">
                    { isLogged? <div id="nav-username">{user}</div> : '' }
                    <ul>
                        { isLogged?
                            <li onClick={this.doLogout}>Logout</li> :
                            <>
                            <Link to="/login"><li>Login</li></Link>
                            <Link to="/signup"><li>Signup</li></Link>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        )
     }
}

const mapStateToProps = (store) => ({
    isLogged: store.authReducer.isLogged,
    user: store.authReducer.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(userSignedOut()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
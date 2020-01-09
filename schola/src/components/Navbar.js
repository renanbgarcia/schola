import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import MenuButton from './utils/menu-button';
import firebase from '../firebase';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { userSignedOut } from '../actions/authAction';

class Navbar extends React.Component {

    constructor(props) {
        super(props);
        this.doLogout = this.doLogout.bind(this);
        this.renderUserPhoto = this.renderUserPhoto.bind(this);
    }

    state = {
        userPhoto: ''
    }

    UNSAFE_componentWillMount() {
        this.setState({
            userPhoto: this.props.user.photoURL
        })
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        console.log(nextProps)
        this.setState({
            userPhoto: nextProps.user.photoURL
        })
    }

    doLogout() {
        firebase.auth().signOut().then(() => {
            this.props.signOut();
        });
        localStorage.clear();
    }

    renderUserPhoto() {
        return this.props.isLogged?
                    <div className="nav-user-photo-wrapper">
                        <img className="nav-user-photo" alt="profile" src={this.state.userPhoto}/>
                    </div>
                    :
                    ''
    }

    render() {

        const { isLogged, user } = this.props;
        console.log(user.displayName + ' ' + isLogged)

        return (
            <nav>
                <MenuButton/>
                <div className="nav-wrapper">
                    { this.renderUserPhoto() }
                    <ul>
                        { isLogged?
                            <li onClick={this.doLogout}><FontAwesomeIcon icon={faSignOutAlt} size="2x" style={{ color: '#fff' }}/></li> :
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
    user: store.authReducer.user,
});

const mapDispatchToProps = (dispatch) => ({
    signOut: () => dispatch(userSignedOut()),
})

export default connect(mapStateToProps, mapDispatchToProps)(Navbar)
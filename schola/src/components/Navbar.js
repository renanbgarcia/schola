import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

class Navbar extends React.Component {
    render() {

        const { isLogged, user } = this.props;
        console.log(user)

        return (
            <nav>
                <div className="nav-wrapper">
                    { isLogged? <span>{user}</span> : '' }
                    <ul>
                        <li>Home</li>
                        { isLogged? '' : <>
                            <Link to="/login"><li>Login</li></Link>
                            <Link to="/signup"><li>Signup</li></Link>
                        </> }
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

export default connect(mapStateToProps)(Navbar)
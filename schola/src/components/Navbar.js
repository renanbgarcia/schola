import React from 'react';
import { connect } from 'react-redux';

class Navbar extends React.Component {
    render() {

        const { isLogged} = this.props;

        return (
            <nav>
                <div className="nav-wrapper">
                    <ul>
                        <li>Home</li>
                        { isLogged? '' : <><li>Login</li><li>Signup</li></> }
                    </ul>
                </div>
            </nav>
        )
     }
}

const mapStateToProps = (store) => ({
    isLogged: store.authReducer.isLogged
})

export default connect(mapStateToProps)(Navbar)
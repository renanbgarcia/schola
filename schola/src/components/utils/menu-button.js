import React from 'react';
import { connect } from 'react-redux';
import { showMenu, hideMenu } from '../../actions/menuAction'; 

class MenuButton extends React.Component {

    constructor(props) {
        super(props);
        this.toggleMenu = this.toggleMenu.bind(this);
    }

    toggleMenu() {
        console.log(this.props);
        if (this.props.isMenuVisible === true) {
            this.props.doHideMenu();
        } else {
            this.props.doShowMenu();
        }
    }

    render() {

        return (
            <div onClick={this.toggleMenu} className="menu-button">Menu</div>
        )
    }
}

const mapStateToProps = (store) => ({
    isMenuVisible: store.menuReducer.isMenuVisible
})

const mapDispatchToProps = dispatch => ({
    doShowMenu: () => dispatch(showMenu()),
    doHideMenu: () => dispatch(hideMenu())
})

export default connect(mapStateToProps, mapDispatchToProps)(MenuButton);
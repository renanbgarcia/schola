import React from 'react';
import { connect } from 'react-redux';
import { showMenu, hideMenu } from '../../actions/menuAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowAltCircleLeft, faArrowCircleDown } from '@fortawesome/free-solid-svg-icons'


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

    chooseArrow() {
        return this.props.isMenuVisible? faArrowCircleDown : faArrowAltCircleLeft;
    }

    render() {

        return (
            <div onClick={this.toggleMenu}
                  className="menu-button">
                    <span style={{marginRight: "3px"}}>Menu</span>
                    <FontAwesomeIcon
                        icon={this.chooseArrow()}
                        style={{color:"#fff"}} />
            </div>
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
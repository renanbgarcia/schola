import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { menuContent } from './menuContent';

class Sidebar extends React.Component {

    renderSidebar() {
        console.log(window.innerWidth)
        if (this.props.isOpen || window.innerWidth > 750) {
            return <div key="sidebar" className="sidebar">
                    {menuContent()}
                   </div>
        } else {
            return null
        }
    }

    render() {
        return (               
            <ReactCSSTransitionGroup
            transitionName="example"
            transitionEnterTimeout={250}
            transitionLeaveTimeout={250}>
                {this.renderSidebar()}
            </ReactCSSTransitionGroup>
        )
    }
}

const mapStateToProps = (store) => ({
    isOpen: store.menuReducer.isMenuVisible
})

export default connect(mapStateToProps)(Sidebar);
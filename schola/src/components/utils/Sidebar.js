import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { menuContent } from './menuContent';

class Sidebar extends React.Component {

    // renderSidebar() {
    //     console.log(window.innerWidth)
    //     if (this.props.isOpen || window.innerWidth > 750) {
    //         return <div key="sidebar" className="sidebar">
    //                 {menuContent()}
    //                </div>
    //     } else {
    //         return <div key="sidebar" className="sidebar sidebar-narrow">
    //             {menuContent()}
    //         </div>
    //     }
    // }

    UNSAFE_componentWillReceiveProps() {
        this.toggleSidebar();
    }

    toggleSidebar() {
        let bar = document.querySelector('.sidebar');
        if (this.props.isOpen) {
            bar.classList.remove('sidebar-narrow');
        } else {
            bar.classList.add('sidebar-narrow');
        }
    }

    render() {
        return (               
            // <ReactCSSTransitionGroup
            // transitionName="example"
            // transitionEnterTimeout={250}
            // transitionLeaveTimeout={250}>
                <div key="sidebar" className="sidebar sidebar-narrow">
                    {menuContent()}
                </div>
            // </ReactCSSTransitionGroup>
        )
    }
}

const mapStateToProps = (store) => ({
    isOpen: store.menuReducer.isMenuVisible
})

export default connect(mapStateToProps)(Sidebar);
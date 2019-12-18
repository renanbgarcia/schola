

import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class PopMenu extends React.Component {

    constructor(props) {
        super(props);
        this.dismissModal = this.dismissModal.bind(this);
    }

    dismissModal(e) {
        if (e.target.id === "popmenu-wrapper") {
            this.props.hideFunc();
        }
    }

    renderModal() {
        const list = this.props.items;

        return this.props.show ?
        <div id="popmenu-wrapper"
        className="popmenu-wrapper"
        onClick={this.dismissModal}>
            <div className="element">
                <div className="pop-menu" style={{
                top: this.props.y,
                left: this.props.x
                }}>
                    <ul>
                        {list.map(item => <li onClick={item.onClick}>{item.title}</li>)}
                    </ul>
                </div>
            </div>
        </div> : null
    }

    render() {
        return (
            <div>
                <ReactCSSTransitionGroup
                transitionName="modal"
                transitionEnterTimeout={250}
                transitionLeaveTimeout={250}>
                    { this.renderModal() }
                </ReactCSSTransitionGroup>
            </div>
        )
    }
}

export default PopMenu;

export const offset = (el) => {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}
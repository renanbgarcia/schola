import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.dismissModal = this.dismissModal.bind(this);
    }

    dismissModal(e) {
        if (e.target.id === "wrapper") {
            this.props.hideFunc();
        }
    }

    renderModal() {
        return this.props.isOpen ?
        <div id="wrapper"
        className="modal-wrapper"
        onClick={this.dismissModal}>
            <div className="element">
                {this.props.Component}
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

export default Modal;
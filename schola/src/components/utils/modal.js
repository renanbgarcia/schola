import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.dismissModal = this.dismissModal.bind(this);
    }

    state = {
        isOpen: false
    }

    dismissModal(e) {
        console.log(e.target.id)
        if (e.target.id === "wrapper") {
            this.setState({ isOpen: false });
        }
    }

    showModal() {
        console.log("show")
        this.setState({ isOpen: true });
    }

    renderModal() {
        return this.state.isOpen ?
        <div id="wrapper"
        className="modal-wrapper"
        onClick={this.dismissModal}>
            {this.props.Component}
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
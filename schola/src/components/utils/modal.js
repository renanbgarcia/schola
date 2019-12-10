import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { connect } from 'react-redux';
import { hideCreateLessonModal, hideCreateCourseModal } from '../../actions/modalActions'

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.dismissModal = this.dismissModal.bind(this);
    }

    dismissModal(e) {
        if (e.target.id === "wrapper") {
            this.props.hideCLModal();
            this.props.hideCCModal();
        }
    }

    renderModal() {
        let condition = this.props.modalCondition;
        return this.props[condition] ?
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

const mapStatetoProps = (store) => ({
    isCreateLesson: store.modalReducer.isCLOpen,
    isCreateCourse: store.modalReducer.isCCOpen
});

const mapDispatchToProps = (dispatch) => ({
    hideCLModal: () => dispatch(hideCreateLessonModal()),
    hideCCModal: () => dispatch(hideCreateCourseModal())
})

export default connect(mapStatetoProps, mapDispatchToProps)(Modal);
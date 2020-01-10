import React from 'react';
import { connect } from 'react-redux';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class Modal extends React.Component {

    constructor(props) {
        super(props);
        this.dismissModal = this.dismissModal.bind(this);
    }

    state = {
        isOpen: false
    }

    UNSAFE_componentWillReceiveProps(next) {
        console.log(next)
        switch (this.props.componentName) {
            case "CreateLesson":
                this.setState({isOpen: next.isCreateLessonOpen});
                break;
            case "CreateCourse":
                this.setState({isOpen: next.isCreateCourseOpen});
                break;
            case "EditLesson":
                this.setState({isOpen: next.isOpen});
                break;
            case "EditCourse":
                this.setState({isOpen: next.isOpen});
                break;
            default:
                console.log('No component will be rendered')
                break;
        }
    }

    dismissModal(e) {
        if (e.target.id === "wrapper") {
            this.props.hideFunc();
        }
    }

    renderModal() {
        return this.state.isOpen ?
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

const mapStateToProps = (store) => ({
    isCreateLessonOpen: store.modalReducer.isCLOpen,
    isCreateCourseOpen: store.modalReducer.isCCOpen,
})

export default connect(mapStateToProps)(Modal);
import React from 'react';
import RegisterStudent from './RegisterStudent';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

class Students extends React.Component {

    constructor(props) {
        super(props);
        this.handleAddStudentClick = this.handleAddStudentClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    state = {
        display: 'none',
        transform: 'scale(0)'
    }
    
    componentDidMount() {
        window.addEventListener('click', this.handleClickOutside)
    }

    handleAddStudentClick(e) {
        let modal = document.querySelector('.register-student-modal');
        this.setState({
            left: e.target.offsetLeft - modal.offsetWidth - 20,
            display: 'contents',
            top: e.target.offsetTop - modal.offsetHeight - 20,
            transform: 'scale(1)'
        })
    }

    handleClickOutside(e) {
        const clicked = e.target
        const bbtn = document.querySelector("#add-student-button")
        const modal = document.querySelector(".register-student-modal");
        let modalChildren = modal.querySelectorAll("*")
        let doesMatchChild = false;
        modalChildren.forEach((child) => {
            if (child === clicked) {
                doesMatchChild = true;
            }
        })

        if (clicked === modal || clicked === bbtn || doesMatchChild === true) {
            console.log('clickou dentro');
        } else {
            this.setState({
                display: 'none',
                transform: 'scale(0)'
            })
        }
    }

    render() {
        return (
            <div >
                <RegisterStudent transform={this.state.transform} display={this.state.display} top={this.state.top} left={this.state.left}/>
                <button id="add-student-button" className="round-button" onClick={(e) => this.handleAddStudentClick(e)}></button>
            </div>
        )
    }
}

export default Students;
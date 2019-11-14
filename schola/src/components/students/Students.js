import React from 'react';
import moment from 'moment';
import RegisterStudent from './RegisterStudent';
import firebase from '../../firebase';
import { alertbox } from '../utils/alert';

class Students extends React.Component {

    constructor(props) {
        super(props);
        this.handleAddStudentClick = this.handleAddStudentClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.studentList = this.studentList.bind(this);
    }

    state = {
        display: 'none',
        transform: 'scale(0)',
        students: []
    }
    
    componentDidMount() {
        window.addEventListener('click', this.handleClickOutside)
        this.getStudents()
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleClickOutside)
    }

    handleAddStudentClick(e) {
        let modal = document.querySelector('.register-student-modal');
        this.setState({
            left: e.target.offsetLeft - modal.offsetWidth,
            display: 'contents',
            top: e.target.offsetTop - modal.offsetHeight,
            transform: 'scale(1)'
        })
    }

    handleClickOutside(e) {
        const clicked = e.target;
        const bbtn = document.querySelector("#add-student-button");
        const modal = document.querySelector(".register-student-modal");
        let modalChildren = modal.querySelectorAll("*");
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

    getStudents() {
        let studentsRef = firebase.firestore().collection(`students`).get();

        studentsRef.then(snapshot => {
            let array = [];
            snapshot.docs.forEach(doc => {
                array.push(doc.data());
            })
            this.setState({
                students: array
            })
        })
    }

    studentList(student) {
        let Bday = moment(student.birthDate)
        let now = moment(new Date());
        let diff = now.diff(Bday, 'years');
        console.log(diff);

        return (
            <div className="student-row">
                <div className="photo-profile-wrapper">
                    <img className="student-profile-pic" src={student.photo} />
                </div>
                <div>{student.name}</div>
                <div>Idade: {diff}</div>
            </div>
        )
    }



    render() {
        console.log(this.state.students)
        return (
            <div >
                {this.state.students.map(student => this.studentList(student))}
                <RegisterStudent transform={this.state.transform} display={this.state.display} top={this.state.top} left={this.state.left}/>
                <button id="add-student-button" className="round-button add-button" onClick={(e) => this.handleAddStudentClick(e)}></button>
            </div>
        )
    }
}



export default Students;
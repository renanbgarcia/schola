import React from 'react';
import moment from 'moment';
import RegisterStudent from './RegisterStudent';
import firebase from '../../firebase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import { alertbox } from '../utils/alert';

class Students extends React.Component {

    constructor(props) {
        super(props);
        this.handleAddStudentClick = this.handleAddStudentClick.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.studentList = this.studentList.bind(this);
        this.deleteStudent = this.deleteStudent.bind(this);
    }

    state = {
        display: 'none',
        transform: 'scale(0)',
        students: []
    }
    
    componentDidMount() {
        window.addEventListener('click', this.handleClickOutside);
        this.getStudents();
    }

    componentWillUnmount() {
        window.removeEventListener('click', this.handleClickOutside);
    }


    /**
     * Ação para clique no botão de adicionar um estudante.
     * Adiciona um estudante ao bd
     * @param {*} e
     */
    handleAddStudentClick(e) {
        let modal = document.querySelector('.register-student-modal');
        this.setState({
            left: e.target.offsetLeft - modal.offsetWidth,
            display: 'contents',
            top: e.target.offsetTop - modal.offsetHeight,
            transform: 'scale(1)'
        })
    }

    /**
     * Ação para clique no espaço geral da tela
     *
     * @param {Event} e
     */
    handleClickOutside(e) {
        const clicked = e.target;
        const bbtn = document.querySelector("#add-student-button");
        const modal = document.querySelector(".register-student-modal");
        const modalChildren = modal.querySelectorAll("*");
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

    /**
     * Recebe estudantes cadastrados no bd
     *
     */
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

    /**
     *Elimina estudante
     *
     * @param {*} student
     */
    deleteStudent(student) {
        console.log(student)
        firebase.firestore()
                .collection(`students`)
                .doc(student.studentId)
                .delete()
                .then(() => {
                    this.getStudents();
                    alertbox.show("Estudante expulso!")
                });
    }

    /**
     * Renderiza o componente item da lista de estudantes(todo: move pra arquivo próprio)
     * 
     * @param {Object} student
     */
    studentList(student) {
        let Bday = moment(student.birthDate)
        let now = moment(new Date());
        let diff = now.diff(Bday, 'years');
        console.log(student);

        return (
            <div className="student-row">
                <div className="photo-profile-wrapper">
                    <img className="student-profile-pic" src={student.photo} />
                </div>
                <div className="student-column">
                    <p>{student.name}</p>
                    <p>Idade: {diff}</p>
                    <p>Turma: {student.turma}</p>
                </div>
                {/* <div className="student-column">
                    <p>Lições feitas:</p>
                    <p>Estrelas:</p>
                </div> */}
                <div className="delete-student-button-wrapper">
                    <FontAwesomeIcon onClick={() => this.deleteStudent(student)} icon={faWindowClose}/>
                </div>
            </div>
        )
    }

    render() {
        console.log(this.state.students)
        return (
            <div className="students-container">
                {this.state.students.map(student => this.studentList(student))}
                <div className="student-row-last"></div>
                <RegisterStudent transform={this.state.transform}
                                 display={this.state.display}
                                 top={this.state.top}
                                 left={this.state.left}
                                 resetList={this.getStudents}/>
                <button id="add-student-button"
                        className="round-button add-button"
                        onClick={(e) => this.handleAddStudentClick(e)}></button>
            </div>
        )
    }
}

export default Students;
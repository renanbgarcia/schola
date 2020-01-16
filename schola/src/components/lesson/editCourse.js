import React from 'react';
import { connect } from 'react-redux'
import firebase from '../../firebase';
import { alertbox } from '../utils/alert';

class EditCourse extends React.Component {

    constructor(props) {
        super(props);

        this.handleName = this.handleName.bind(this);
        this.handleAge = this.handleAge.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleDiscipline = this.handleDiscipline.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.populateForm = this.populateForm.bind(this);
    }

    state = {
        nameInput: '',
        descInput: '',
        disciplineInput: '',
        ageInput: 18
    }

    UNSAFE_componentWillMount() {
        this.populateForm();
    }

    getIdParam() {
        console.log(this.props.match.params.id)
        return this.props.match.params.id;
    }

    handleName(e) {
        this.setState({
            nameInput: e.target.value
        })
    }

    handleAge(e) {
        this.setState({
            ageInput: e.target.value
        })
    }

    handleDescription(e) {
        this.setState({
            descInput: e.target.value
        })
    }

    handleDiscipline(e) {
        this.setState({
            disciplineInput: e.target.value
        })
    }

    populateForm() {
        const db = firebase.firestore();
        const docRef = db.collection('courses').doc(this.props.courseId);
        console.log(docRef)

        docRef.get().then(doc => {
            console.log(doc.data())
            this.setState({
                nameInput: doc.data().title,
                descriptionInput: doc.data().desc,
                disciplineInput: doc.data().discipline,
                ageInput: doc.data().targetAge,
            })
            return doc
        })
        .then((doc) => {
            document.querySelector('#description').value = this.state.descriptionInput;
            document.querySelector('#title').value = this.state.nameInput;
            document.querySelector('#age').value = this.state.ageInput;
            document.querySelector('#discipline').value = this.state.disciplineInput;
        })
    }

    handleSubmit() {
        const db = firebase.firestore();
        let doc = db.collection('courses').doc(this.props.courseId);
        try {
            doc.update({
                title: this.state.nameInput,
                desc: this.state.descInput,
                discipline: this.state.disciplineInput,
                targetAge: this.state.ageInput,
            }).then(() => {
                alertbox.show("Curso atualizado com sucesso!")
                this.props.updateData();
            });
        } catch(err) {
            console.log(err)
            alertbox.show("Ocorreu um erro :(")
            throw err
        }
    }

    render() {
        return (
            <div className="create-course-modal">
                <label>Nome:</label>
                <input id="title" onChange={(e) => this.handleName(e)} type="text"/>
                <label>Descrição:</label>
                <input id="description" onChange={(e) => this.handleDescription(e)} type="text"/>
                <label>Matéria:</label>
                <select id="discipline" onChange={(e) => this.handleDiscipline(e)}>
                    <option value="math">Matemática</option>
                    <option value="grammar">Gramática</option>
                    <option value="english">Inglês</option>
                    <option value="history">História</option>
                    <option value="biology">Biologia</option>
                </select>
                <label>Idade:</label>
                <div class="range-value">{this.state.ageInput}</div>
                <input id="age" onChange={(e) => this.handleAge(e)} type="range" max="18" min="0"/>
                <button onClick={this.handleSubmit} className="full-width">Atualizar</button>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.user
});

export default connect(mapStateToProps)(EditCourse);
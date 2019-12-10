import React from 'react';
import { connect } from 'react-redux'
import firebase from '../../firebase';
import { alertbox } from '../utils/alert';
// import { updateFoldersData } from '../../actions/foldersDataAction';

class CreateCourses extends React.Component {

    constructor(props) {
        super(props);

        this.handleName = this.handleName.bind(this);
        this.handleAge = this.handleAge.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleDiscipline = this.handleDiscipline.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        nameInput: '',
        descInput: '',
        disciplineInput: 'math',
        ageInput: 18
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

    handleSubmit() {
        const db = firebase.firestore();
        let doc = db.collection('courses').doc();
        const docID = doc.id;
        try {
            doc.set({
                title: this.state.nameInput,
                desc: this.state.descInput,
                discipline: this.state.disciplineInput,
                targetAge: this.state.ageInput,
                course_id: docID,
                author_id: this.props.user.uid,
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
            }).then(() => {
                this.props.updateData();
                alertbox.show("Curso criado com sucesso!")
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
                <input onChange={(e) => this.handleName(e)} type="text"/>
                <label>Descrição:</label>
                <input onChange={(e) => this.handleDescription(e)} type="text"/>
                <label>Matéria:</label>
                <select onChange={(e) => this.handleDiscipline(e)}>
                    <option value="math">Matemática</option>
                    <option value="grammar">Gramática</option>
                    <option value="english">Inglês</option>
                    <option value="history">História</option>
                    <option value="biology">Biologia</option>
                </select>
                <label>Idade:</label>
                <div class="range-value">{this.state.ageInput}</div>
                <input onChange={(e) => this.handleAge(e)} type="range" max="18" min="0"/>
                <button onClick={this.handleSubmit} className="full-width">Criar</button>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.user
});

// const mapDispatchToProps = (dispatch) => ({
//     setFoldersData: () => dispatch(updateFoldersData([{title: "Loading", children: []}]))
// });

export default connect(mapStateToProps)(CreateCourses);
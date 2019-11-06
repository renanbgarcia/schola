import React from 'react';
import { connect } from 'react-redux';

import LessonsListf from './LessonListf';

import MDSpinner from "react-md-spinner";

class Lessons extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        lessons: [],
        disciplineFilter: '',
        ageFilter: '',
        lastDoc: {},
    }

    handleDisciplineFilter(e) {
        console.log(e.currentTarget.value)
        this.setState({
            disciplineFilter: e.currentTarget.value
        });
    }

    handleAgeFilter(e) {
        this.setState({
            ageFilter: e.currentTarget.value
        });
    }

    render() {
        let ageArray = Array.apply(null, Array(18));
        return (
            <div className="home-container">
                <label>Age:</label>
                <select onChange={(e) => this.handleAgeFilter(e)} id="age-filter">
                    <option value="">Todas</option>
                    { ageArray.map((key, i) => <option value={i + 1}>{i + 1}</option>) }
                </select>
                <label>Disciplina:</label>
                <select onChange={(e) => this.handleDisciplineFilter(e)} id="discipline-filter">
                    <option value="">Todas</option>
                    <option value="grammar">Gramática</option>
                    <option value="english">Inglês</option>
                </select>

                <tr className="listView-item-container">
                    <td className="title">Título</td>
                    <td>Arquivos</td>
                    <td>Idade alvo</td>
                    <td>Disciplina</td>
                    <td>Criado em</td>
                    <td>Excluir</td>
                </tr>
                <LessonsListf
                disciplineFilter={this.state.disciplineFilter}
                ageFilter={this.state.ageFilter}
                />
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.currentUser,
    userObject: store.authReducer.user,
    isLogged: store.authReducer.isLogged
  });

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(Lessons)
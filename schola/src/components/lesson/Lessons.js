import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';

import LessonsList from './LessonList';
import LessonsListf from './LessonListf';
import SuperList from '../home/superList';

import MDSpinner from "react-md-spinner";

class Lessons extends React.Component {
    constructor(props) {
        super(props)
        // this.queryLessons = this.queryLessons.bind(this)
        // this.docRef = this.docRef.bind(this)
    }

    state = {
        lessons: [],
        disciplineFilter: '',
        ageFilter: '',
        lastDoc: {},
    }

    // docRef = (startAfter) => 
    //     firebase.firestore().collection(`lessons`)
    //     .where('author_id', '==', this.props.userObject.uid )
    //     .where('discipline', '==', this.state.disciplineFilter)
    //     .orderBy('created_at', "desc")
    //     .startAfter(startAfter)
    //     .limit(10)
    //     .get();

    // if (this.state.disciplineFilter === '') {
    //     return (
    //         firebase.firestore().collection(`lessons`)
    //         .where('author_id', '==', this.props.userObject.uid )
    //         .orderBy('created_at', "desc")
    //         .startAfter(startAfter)
    //         .limit(10)
    //         .get()
    //     )
    // } else {
    //     return (
    //         firebase.firestore().collection(`lessons`)
    //         .where('author_id', '==', this.props.userObject.uid )
    //         .where('discipline', '==', this.state.disciplineFilter)
    //         .orderBy('created_at', "desc")
    //         .startAfter(startAfter)
    //         .limit(10)
    //         .get()
    //     )
    // }

    // docRef(startAfter) {
    //     let baseQ = firebase.firestore().collection(`lessons`).where('author_id', '==', this.props.userObject.uid );

    //     if (this.state.disciplineFilter !== '') {
    //         baseQ = baseQ.where('discipline', '==', this.state.disciplineFilter);
    //     }
    //     if (this.state.ageFilter !== '') {
    //         baseQ = baseQ.where('targetAge', '==', this.state.ageFilter)
    //     }

    //     baseQ = baseQ.orderBy('created_at', "desc")
    //                 .startAfter(startAfter)
    //                 .limit(10)
    //                 .get()
    //     return baseQ
    // }

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

    // addQueryFilters(snap) {
    //     let newSnap = snap;
    //     if (this.state.disciplineFilter !== '') {
    //         newSnap = snap.where('discipline', '==', this.state.disciplineFilter);
    //     }
    //     if (this.state.ageFilter !== '') {
    //         newSnap = newSnap.where('targetAge', '==', this.state.ageFilter);
    //     }
    //     return newSnap.get()
    // }


    render() {
        let ageArray = Array.apply(null, Array(18));
        // console.log(this.state)
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
                </tr>
                <LessonsListf
                // docRef={this.docRef}
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
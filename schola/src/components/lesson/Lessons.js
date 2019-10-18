import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';

import MDSpinner from "react-md-spinner";

class Lessons extends React.Component {
    constructor(props) {
        super(props)
    }

    state = {
        lessons: [],
        isLoaded: false,
        disciplineFilter: '',
        ageFilter: ''
    }
    
    componentWillMount() {
        this.queryLessons();
    }

    queryLessons() {
        // let  snap = firebase.firestore().collection(`users/${this.props.userObject.uid}/lessons`)
        let  snap = firebase.firestore().collection(`lessons`)
        let filteredSnap = this.addQueryFilters(snap);
        filteredSnap.then(snapshot => snapshot.forEach(doc => {
            let oldlessons = this.state.lessons;
            oldlessons.push(doc.data())
            this.setState({
                lessons: oldlessons,
                isLoaded: true
            })
        }))
    }

    handleDisciplineFilter(e) {
        console.log(e.currentTarget.value)
        this.setState({
            lessons: [],
            disciplineFilter: e.currentTarget.value
        }, () => {this.queryLessons()});
    }

    handleAgeFilter(e) {
        this.setState({
            lessons: [],
            ageFilter: e.currentTarget.value
        }, () => {this.queryLessons()});
    }

    addQueryFilters(snap) {
        let newSnap = snap;
        if (this.state.disciplineFilter !== '') {
            newSnap = snap.where('discipline', '==', this.state.disciplineFilter);
        }
        if (this.state.ageFilter !== '') {
            newSnap = newSnap.where('targetAge', '==', this.state.ageFilter);
        }
        return newSnap.get()
    }

    render() {
        let ageArray = Array.apply(null, Array(18));
        return (
            <div>
                <h3>Lições</h3>
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
                <table>
                    <tbody>
                    {   
                        !this.state.isLoaded ?
                        <MDSpinner singleColor={'#727272'}/>
                        : 
                        this.state.lessons.map(lesson =>
                        <tr>
                            <td>{lesson.title}</td>
                            <td>{lesson.created_at? lesson.created_at.toDate().toString() : ''}</td>
                            <td>{lesson.discipline}</td>
                            <td>{lesson.targetAge}</td>
                        </tr>)
                    }
                    </tbody>
                </table>
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
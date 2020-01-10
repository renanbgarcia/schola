import React from 'react';
import { connect } from 'react-redux';
import firebase from '../../firebase';
import { categories, getMaterias } from '../utils/variables';
import ScheduleCalendar from '../calendar/scheduleCalendar';
import { alertbox } from '../utils/alert';
import { hidePopMenu } from '../../actions/menuAction';

import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class EditLesson extends React.Component {

    constructor(props) {
        super(props);
        this.sendLessonInfo = this.sendLessonInfo.bind(this);
        // this.getIdParam = this.getIdParam.bind(this);
        this.populateForm = this.populateForm.bind(this);
        this.confirmTags = this.confirmTags.bind(this);
        this.deleteTagPill = this.deleteTagPill.bind(this);
        this.handleTagInput = this.handleTagInput.bind(this);
        this.insertTagPills = this.insertTagPills.bind(this);
        this.renderCoursesCheckboxes = this.renderCoursesCheckboxes.bind(this);
        this.handleCourseInput = this.handleCourseInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    state = {
        courses: [],
        tags: [],
        tagsInput: [],
        coursesInput: [],
        dateInput: 0,
        timeInput: '',
        event: '',
    }

    UNSAFE_componentWillMount() {
        this.populateForm();
        // this.getCourses();
    }

    UNSAFE_componentDidMount() {
        let tagsInputElem = document.getElementById('tags-input');
        tagsInputElem.addEventListener('keypress', (e) => {
            let key = e.which || e.keyCode;
            console.log(e.keyCode)
            if (key === 13) {
                this.confirmTags();
                tagsInputElem.value = "";
            }
        })
    }

    getCourses(discipline) {
        console.log('got courses')
        
        firebase.firestore()
                .collection('courses')
                .where('discipline', '==', discipline)
                .where('author_id', '==', this.props.user.uid)
                .get()
                .then(snap => {
                    let courses = [];
                    for (let doc of snap.docs) {
                        courses.push({title: doc.data().title, id: doc.data().course_id})
                    }
                    return courses
                })
                .then((courses) => {
                    this.setState({
                        courses: courses
                    })
                })
                .then(() => {
                    let checkedElems = document.querySelectorAll('.checkbox-elem-wrapper input');
                        checkedElems.forEach((elem) => {
                            if (this.state.coursesInput.indexOf(elem.value ) !== -1) {
                                elem.setAttribute('checked', 'checked');
                            } else {
                                elem.removeAttribute('checked');
                            }
                        })
                });
    }

    // getIdParam() {
    //     return this.props.match.params.id;
    // }

    populateForm() {
        const db = firebase.firestore();
        console.log(this.props)
        const docRef = db.collection('lessons').doc(this.props.lessonId);
        let eventRef;

        docRef.get().then(doc => {
            if (doc.data().event === undefined || doc.data().event === 0) {
                eventRef = db.collection('events').doc();
            } else {
                eventRef = db.collection('events').doc(doc.data().event);
            }
            eventRef.get().then(doc => {
                this.setState({timeInput: doc.data().events[0].time});
                document.querySelector('#time').value = moment.utc(moment.duration(doc.data().events[0].time, "seconds").asMilliseconds()).format("HH:mm");
            })
            this.setState({
                titleInput: doc.data().title,
                ageInput: doc.data().targetAge,
                disciplineInput: doc.data().discipline,
                descriptionInput: doc.data().desc,
                tags: doc.data().tags,
                coursesInput: doc.data().course_id,
                categoryInput: doc.data().category,
                dateInput: doc.data().scheduled,
                event: doc.data().event ? doc.data().event : 0,

                // lesson_id: doc.data().lesson_id
            })
            return doc
        })
        .then((doc) => {
            console.log(doc.data())
            document.querySelector('#description').value = this.state.descriptionInput;
            document.querySelector('#title').value = this.state.titleInput;
            document.querySelector('#age').value = this.state.ageInput;
            document.querySelector('#category').value = this.state.categoryInput;
            document.querySelector('#discipline').value = this.state.disciplineInput;
            document.querySelector('#date').value = moment.unix(this.state.dateInput).format('YYYY-MM-DD');
            this.getCourses(doc.data().discipline);
        })
    }

    sendLessonInfo() {
        try {
            let db = firebase.firestore();
            let docRef = db.collection('lessons').doc(this.props.lessonId);
            // let docID = docRef.id;

            this.DoSchedule(this.props.lessonId);
    
            docRef.update({
                // lesson_id: docID,
                title: this.state.titleInput,
                targetAge: this.state.ageInput,
                discipline: this.state.disciplineInput,
                desc: this.state.descriptionInput,
                tags: this.state.tags,
                course_id: this.state.coursesInput,
                category: this.state.categoryInput,
                scheduled: this.state.dateInput,
                event: this.state.event
            });        

            // return this.state.lesson_id
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
        }
    }

    DoSchedule(lessonId) {
        try {
            let docRef;
            let db = firebase.firestore();
            if (this.state.event === undefined || this.state.event === 0) {
                docRef = db.collection('events').doc();
            } else {
                docRef = db.collection('events').doc(this.state.event);
            }

            // let docID = docRef.id;
    
            docRef.set({
                id: docRef.id,
                author_id: this.props.user.uid,
                lesson_id: lessonId,

                events: [
                    {
                        title: this.state.titleInput,
                        start: this.state.dateInput + this.state.timeInput,
                        end: this.state.dateInput + this.state.timeInput,
                        time: this.state.timeInput,
                        date: this.state.dateInput
                    }
                ]
            });

            // return docID
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
            throw error;
        }
    }
    
    handleTitleInput(e) {
        this.setState({ titleInput: e.target.value });
    }

    handleAgeInput(e) {
        this.setState({ ageInput: e.target.value });
    }

    handleDisciplineInput(e) {
        this.setState({ disciplineInput: e.currentTarget.value }, this.getCourses(e.currentTarget.value, this.props.user.uid));
    }

    handleDescriptionInput(e) {
        this.setState({ descriptionInput: e.target.value });
    }

    handleCategory(e) {
        this.setState({
            categoryInput: e.currentTarget.value
        })
    }

    handleCourseInput(e) {
        let checkedElems = document.querySelectorAll('.create-lesson-checkbox-wrapper input:checked');
        let newElements = [];
        checkedElems.forEach(elem => newElements.push(elem.value))
        this.setState({
            coursesInput: newElements
        })
        console.log(newElements)
    }

    handleTagInput(e) {
        let value = e.target.value;
        let valueArray = value.split(' ');
        valueArray = valueArray.filter((tag) => {
            return tag !== "";
        })
        console.log(valueArray)
        this.setState({
            tagsInput: valueArray
        })
    }
    
    confirmTags() {
        this.setState({
            tags: this.state.tags.concat(this.state.tagsInput)
        }, this.setState({
            tagsInput: []
        }))
    }

    insertTagPills(e) {
        let key = e.which || e.keyCode;
        if (key === 13) { 
            this.confirmTags();
            e.target.value = "";
        }
    }

    deleteTagPill(tag) {
        let tags = this.state.tags;
        const idx = tags.indexOf(tag);

        tags.splice(idx, 1);

        this.setState({
            tags: tags
        })
    }

    handleDateInput(e) {
        this.setState({
            dateInput: moment(e.target.value).unix()
        })
    }

    handleTimeInput(e) {
        this.setState({
            timeInput: moment.duration(e.target.value, 'HH:mm').asSeconds()
        })
    }

    renderCoursesCheckboxes(courses) {
        return courses.map((course) => {
            if (this.state.coursesInput.indexOf(course.id) === -1) {
                return <div>
                        <input type="checkbox" value={ course.id }/><div title={ course.title }>{ course.title }</div>
                    </div>
            } else {
                return <div>
                        <input type="checkbox" defaultChecked value={ course.id }/><div title={ course.title }>{ course.title }</div>
                    </div>
            }
        })
    }

    handleSubmit() {
        if (this.state.coursesInput.length === 0) {
            alertbox.show('Você escolheu uma disciplina que não possui cursos.\nCrie um curso para essa dsiciplina antes de criar um material.');
            return
        }
        if (this.state.titleInput &&
            this.state.ageInput &&
            this.state.disciplineInput &&
            this.state.descriptionInput !== '') {
            try {
                this.sendLessonInfo();
                // this.uploadFiles(this.props.lessonId);

            } catch(err) {
                console.log(err);
            }
            alertbox.show('Lição atualizada!');
            this.props.hidePopMenu();
            this.props.updateData()
        } else {
            alertbox.show('Preencha todos os campos corretamente.')
        }
    }

    render() {

        return (
        <div className="create-lesson-container">
        <div className="row">
            <div className="column">
                <div className="create-lesson-form">
                    <label for="titulo">Título</label>
                    <input onChange={e => this.handleTitleInput(e)}
                            type="text"
                            name="titulo"
                            id="title"/>
                    <div className="row">
                        <div className="column column-25 mobile-full-width">
                            <label for="idade">Idade alvo</label>
                            <input onChange={e => this.handleAgeInput(e)}
                                    type="number"
                                    name="idade"
                                    id="age"
                                    min="0"
                                    max="18"/>
                        </div>
                        <div className="column column-75 mobile-full-width">
                            <label >Disciplina</label>
                            <select onChange={(e) => this.handleDisciplineInput(e)} id="discipline">
                                <option>Escolha uma disciplina</option>
                                { getMaterias().map(mat => <option value={ mat.name }>{ mat.title }</option>) }
                            </select>
                        </div>
                    </div>
                    <textarea
                        onChange={e => this.handleDescriptionInput(e)}
                        id="description"
                        name="description"
                        defaultValue="Descreva o material">
                    </textarea>
                    <div className="row">
                        <div className="column">
                            <label>Categoria</label>
                            <select id="category" onChange={(e) => this.handleCategory(e)}>
                                <option>Escolha uma categoria</option>
                                {categories.map(cat => <option value={ cat.title }>{ cat.title }</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <label>Tags:</label>
                            <input type="text"
                                    onChange={this.handleTagInput}
                                    onKeyPress={(e) => this.insertTagPills(e)}
                                    id="tags-input"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <div className="tags-wrapper">
                                {this.state.tags.map((tag) => 
                                    <span className="tag-pill">
                                        {tag} 
                                        <FontAwesomeIcon onClick={() => this.deleteTagPill(tag)}
                                                            icon={faTimesCircle}
                                                            style={{color:"#fff"}}/>
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <input onChange={(e) => this.handleDateInput(e)} id="date" type="date"/>
                        </div>
                        <div className="column">
                            <input onChange={(e) => this.handleTimeInput(e)} id ="time" type="time"/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="column">
                            <div onChange={this.handleCourseInput}>
                                <legend>Cursos: </legend>
                                <div className="create-lesson-checkbox-wrapper">
                                    {/* { this.renderCoursesCheckboxes(this.state.courses) } */}
                                    { this.state.courses.map((course) => {
                                        return <div className="checkbox-elem-wrapper">
                                                    <input type="checkbox" value={ course.id }/><div title={ course.title }>{ course.title }</div>
                                                </div>
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <button className="full-width" onClick={this.handleSubmit}>Atualizar</button>
            </div>
            {/* <ScheduleCalendar/> */}
        </div>
        </div>
        )
    }
}

const mapStateToProps = (store) => ({
    user: store.authReducer.user
})

const mapDispatchToProps = (dispatch) => ({
    hidePopMenu: () => dispatch(hidePopMenu()),
})

export default connect(mapStateToProps, mapDispatchToProps)(EditLesson);
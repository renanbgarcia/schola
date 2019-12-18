import React from 'react';
import firebase from '../../firebase';
import { categories, getMaterias } from '../utils/variables';
import ScheduleCalendar from '../calendar/scheduleCalendar';
import { alertbox } from '../utils/alert';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'

class EditLesson extends React.Component {

    constructor(props) {
        super(props);
        this.sendLessonInfo = this.sendLessonInfo.bind(this);
        this.getIdParam = this.getIdParam.bind(this);
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
        coursesInput: []
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
                                console.log('foi')
                                elem.setAttribute('checked', 'checked');
                            } else {
                                elem.removeAttribute('checked');
                            }
                        })
                });
    }

    getIdParam() {
        return this.props.match.params.id;
    }

    populateForm() {
        const db = firebase.firestore();
        const docRef = db.collection('lessons').doc(this.getIdParam());

        docRef.get().then(doc => {
            this.setState({
                titleInput: doc.data().title,
                ageInput: doc.data().targetAge,
                disciplineInput: doc.data().discipline,
                descriptionInput: doc.data().desc,
                tags: doc.data().tags,
                coursesInput: doc.data().course_id,
                categoryInput: doc.data().category,
                scheduled: doc.data().events
            })
            return doc
        })
        .then((doc) => {
            document.querySelector('#description').value = this.state.descriptionInput;
            document.querySelector('#title').value = this.state.titleInput;
            document.querySelector('#age').value = this.state.ageInput;
            document.querySelector('#category').value = this.state.categoryInput;
            document.querySelector('#discipline').value = this.state.disciplineInput;
            this.getCourses(doc.data().discipline);
        })
    }

    sendLessonInfo() {
        try {
            const db = firebase.firestore();
            const docRef = db.collection('lessons').doc(this.getIdParam());
            const docID = docRef.id;

            docRef.get().then(doc => console.log(doc.data()))

            docRef.update({
                title: this.state.titleInput,
                targetAge: this.state.ageInput,
                discipline: this.state.disciplineInput,
                desc: this.state.descriptionInput,
                tags: this.state.tags,
                course_id: this.state.coursesInput,
                category: this.state.categoryInput,
                // created_at: firebase.firestore.Timestamp.fromDate(new Date()),
                // scheduled: this.state.events,
                // author: this.props.userObject.displayName,
                // author_id: this.props.userObject.uid,
                // authorProto: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png',
                // rating: '--'
            });

            // this.DoSchedule();

            return docID
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
        }
        alertbox.show('Atualizado com sucesso :)')
    }

    DoSchedule() {
        // try {
        //     let db = firebase.firestore();
        //     let docRef = db.collection('events').where('author_id', '==', this.getIdParam());
        //     docRef.then((snapshot) => {
        //         snapshot.docs.for
        //     })
        //     docRef.update({events: this.state.events})
        // } catch(error) {
        //     console.log(error);
        //     alertbox.show('Ocorreu um erro :(')
        //     throw error;
        // }
    }
    
    handleTitleInput(e) {
        this.setState({ titleInput: e.target.value });
    }

    handleAgeInput(e) {
        this.setState({ ageInput: e.target.value });
    }

    handleDisciplineInput(e) {
        this.setState({ disciplineInput: e.currentTarget.value }, this.getCourses(e.currentTarget.value));
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
        if (this.state.titleInput &&
            this.state.ageInput &&
            this.state.disciplineInput &&
            this.state.descriptionInput !== '') {
            try {
                let lessonID = this.sendLessonInfo();
                this.uploadFiles(lessonID);

            } catch(err) {
                console.log(err);
            }
            alertbox.show('Lição cadastrada!');
        } else {
            alertbox.show('Preencha todos os campos corretamente.')
        }
    }

    render() {
        console.log(this.state)
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
                    {/* <div className="row">
                        <div className="column">
                            <label className="input-file-label" for="lesson-file">Carregar arquivos</label>
                            <input onChange={this.handleFileInput}
                                    type="file"
                                    id="lesson-file"
                                    multiple/>
                        </div>
                    </div> */}
                    {/* <div className="row row-center">
                        <ul className="file-list">
                            {this.state.fileList.map((item, i) =>
                                <li className="file-list-item">
                                    {item.name}
                                    <span id={item.name}></span>
                                    <span onClick={(i) => this.deleteListItem(i)} >
                                        <FontAwesomeIcon className="delete-button-list" icon={faTimesCircle}/>
                                    </span>
                                </li>
                            )}
                        </ul>
                    </div> */}
                </div>
                <button className="full-width" onClick={this.handleSubmit}>Atualizar</button>
            </div>
            {/* <ScheduleCalendar/> */}
        </div>
        </div>
        )
    }
}

export default EditLesson;
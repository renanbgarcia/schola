import React from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux'; 

import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import { alertbox } from '../utils/alert';
import { categories, getMaterias } from '../utils/variables';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import moment from 'moment';

import CalendarBox from '../utils/calendar/calendarEditBox';
import CalendarToolbarSmall from '../utils/calendar/ToolbarSmall';
import ScheduleCalendar from '../calendar/scheduleCalendar';

import Modal from '../utils/modal';

const DnDCalendar = withDragAndDrop(Calendar);

class CreateLesson extends React.Component {

    constructor(props) {
        super(props)
        this.handleFileInput = this.handleFileInput.bind(this);
        this.uploadFiles = this.uploadFiles.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTagInput = this.handleTagInput.bind(this);
        this.confirmTags = this.confirmTags.bind(this);
        this.DoSchedule = this.DoSchedule.bind(this);
        this.hideParentModal =this.hideParentModal.bind(this);
        this.getCourses = this.getCourses.bind(this);
        this.handleCourseInput = this.handleCourseInput.bind(this);
        this.handleDateInput = this.handleDateInput.bind(this);
    }

    state = {
        fileList: [],
        titleInput: '',
        ageInput: '',
        disciplineInput: '',
        descriptionInput: '',
        categoryInput: '',
        tagsInput: [],
        tags: [],
        dateInput: '',
        timeInput: '',
        courses: [],
        coursesInput: []
    }

    componentDidMount() {
        let tagsInputElem = document.getElementById('tags-input');
        tagsInputElem.addEventListener('keypress', (e) => {
            let key = e.which || e.keyCode;
            if (key === 13) { 
                this.confirmTags();
                tagsInputElem.value = "";
            }
        })
    }

    handleFileInput() {
        let fileList = document.getElementById('lesson-file').files;
        this.setState({
            fileList: Array.from(fileList)
        })
    }

    handleTitleInput(e) {
        this.setState({ titleInput: e.target.value });
    }

    handleAgeInput(e) {
        this.setState({ ageInput: e.target.value });
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

    /**
     * Remove um item da lista de upload
     * @param {*} i 
     */
    deleteListItem(i) {
        let newState = this.state.fileList;
        newState.splice(i, 1);
        this.setState({ fileList: newState});
    }

    /**
     * 
     */
     uploadFiles(id) {
        const self = this;
        let db = firebase.firestore();
        // let docRef = db.collection(`users/${this.props.userObject.uid}/lessons`).doc(id);
        let docRef = db.collection(`lessons`).doc(id);
        for (let file of this.state.fileList) {
            let storageRef = firebase.storage().ref(`${this.props.userObject.uid}/lessons/${id}/${file.name}`);
            let uploadTask = storageRef.put(file);
            uploadTask.on('state_changed', function(snapshot){
                let progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                //Render a informação no item da lista
                document.getElementById(file.name).innerHTML = `Progresso: ${progress}%`;
            }, function(error) {
                console.log("Ocorreu um erro: " + error);
                alertbox.show('Ocorreu um erro :(')
                throw error;
            }, function() {
            uploadTask.snapshot.ref.getDownloadURL()
                .then(function(downloadURL) {
                    console.log('File available at', downloadURL);
                    let updatedArray = firebase.firestore.FieldValue.arrayUnion(downloadURL)
                    docRef.update({
                        filesURLs: updatedArray
                    })
                    self.deleteListItem();
                });
            });
        }
    }

    /**
     * Insere no banco as informações da lesson, incluindo urls dos arquivos
     * @param {[uploadTask]} urls 
     */
    sendLessonInfo() {
        try {
            let db = firebase.firestore();
            let docRef = db.collection('lessons').doc();
            let docID = docRef.id;
    
            docRef.set({
                lessonId: docID,
                title: this.state.titleInput,
                targetAge: this.state.ageInput,
                discipline: this.state.disciplineInput,
                desc: this.state.descriptionInput,
                tags: this.state.tags,
                course_id: this.state.coursesInput,
                category: this.state.categoryInput,
                created_at: firebase.firestore.Timestamp.fromDate(new Date()),
                scheduled: this.state.dateInput,

                author: this.props.userObject.displayName,
                author_id: this.props.userObject.uid,
                authorPhoto: 'https://cdn2.iconfinder.com/data/icons/ios-7-icons/50/user_male2-512.png',
                rating: '--'
            });

            this.DoSchedule();

            return docID
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
        }
    }

    DoSchedule() {
        try {
            let db = firebase.firestore();
            let docRef = db.collection('events').doc();
            let docID = docRef.id;
    
            docRef.set({
                id: docID,
                author_id: this.props.userObject.uid,
                events: [
                    {
                        title: this.state.titleInput,
                        start: this.state.dateInput + this.state.timeInput,
                        end: this.state.dateInput + this.state.timeInput
                    }
                ]
            });
        } catch(error) {
            console.log(error);
            alertbox.show('Ocorreu um erro :(')
            throw error;
        }
    }

    //era para renderizar o progesso do upload no component - não está sendo usado
    renderProgress(id, progress) {
        document.getElementById(id).innerHTML = `Completado: ${progress}%`;
    }

    handleTagInput(e) {
        let value = e.target.value;
        let valueArray = value.split(' ');
        valueArray = valueArray.filter((tag) => {
            return tag !== "";
        })
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

    handleCourseInput(e) {
        console.log(e.target.value)
        this.setState({
            coursesInput: [...this.state.coursesInput, e.target.value]
        })
    }

    handleSubmit() {
        if (this.state.titleInput &&
            this.state.ageInput &&
            this.state.disciplineInput &&
            this.state.descriptionInput !== '') {
            try {
                // for (let i = 0; i < 30 ; i++ ) {
                //     this.sendLessonInfo(i);
                // }
                let lessonID = this.sendLessonInfo();
                this.uploadFiles(lessonID);

            } catch(err) {
                console.log(err);
            }
            alertbox.show('Lição cadastrada!');
            this.props.updateData();
            this.hideParentModal();
        } else {
            alertbox.show('Preencha todos os campos corretamente.')
        }
    }

    hideParentModal() {
        if (this.props.hideModal) {
            this.props.hideModal();
        }
    }

    eventComponent(e) {
        return <div>{e.title}</div>
    }

    render() {
        console.log(this.state)
        return (
            <div className="create-lesson-container">
                <div>
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
                                        <label for="titulo">Disciplina</label>
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
                                        <select onChange={(e) => this.handleCategory(e)}>
                                            <option>Escolha uma categoria</option>
                                            {categories.map(cat => <option value={ cat.title }>{ cat.title }</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <label>Tags:</label>
                                        <input type="text" onChange={this.handleTagInput} id="tags-input"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <div className="tags-wrapper">
                                            {this.state.tags.map((tag) => <span className="tag-pill">{tag} <FontAwesomeIcon onClick={() => this.deleteTagPill(tag)} icon={faTimesCircle} style={{color:"#fff"}}/></span>)}
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <fieldset onChange={this.handleCourseInput}>
                                            <legend>Cursos: </legend>
                                            <div className="create-lesson-checkbox-wrapper">
                                                { this.state.courses.map((course) => { return <div><input type="checkbox" value={ course.id }/><div title={ course.title }>{ course.title }</div></div> })}
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <input onChange={(e) => this.handleDateInput(e)} type="date"/>
                                    </div>
                                    <div className="column">
                                        <input onChange={(e) => this.handleTimeInput(e)} type="time"/>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="column">
                                        <label className="input-file-label" for="lesson-file">Carregar arquivos</label>
                                        <input onChange={this.handleFileInput}
                                                type="file"
                                                id="lesson-file"
                                                multiple/>
                                    </div>
                                </div>
                                <div className="row row-center">
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
                                </div>
                            </div>
                        </div>
                        {/* <div className="column">
                            <ScheduleCalendar/>
                            <br/>
                        </div> */}
                    </div>
                    <div className="row">
                        <div className="column">
                            <button className="full-width send-lesson-button" onClick={this.handleSubmit}>Enviar</button>
                            { this.props.hasOwnProperty("modalCondition") ? <button className="full-width" onClick={this.hideParentModal}>Fechar</button> : null }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user,
  });

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateLesson)
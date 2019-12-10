import React from 'react';
import { connect } from 'react-redux';
import LessonsFolder from './lessonsFolder';
import firebase from '../../firebase';
import LessonsListf from '../lesson/LessonListf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faListAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { showCreateLessonModal, showCreateCourseModal } from '../../actions/modalActions';
import { updateFoldersData } from '../../actions/foldersDataAction';
import Modal from '../utils/modal';
import CreateLesson from '../lesson/CreateLesson';
import CreateCourses from '../lesson/CreateCourses';

class Lessons extends React.Component {

    constructor(props) {
        super(props);
        this.retrieveFoldersData = this.retrieveFoldersData.bind(this);
    }

    state = {
        view: 'tree',
        lessons: [],
        disciplineFilter: '',
        ageFilter: '',
        lastDoc: {},
        treeData: [{ title: 'Loading', children: [] }]
    }

    UNSAFE_componentWillMount() {
        this.retrieveFoldersData();
    }

    retrieveFoldersData() {
        let categories = [
            { title: "Atividade", children: []},
            { title: "Exercício", children: []},
            { title: "Livro", children: []},
            { title: "Música", children: []},
            { title: "Vídeo", children: []},
            { title: "Apostila", children: []},
            { title: "Filme", children: []},
        ]

        let materias = [
            { title: "Matemática", name: "math", children: []},
            { title: "História", name: "history", children: []},
            { title: "Gramática", name: "grammar", children: []},
            { title: "Artes", name: "art", children: []},
        ]

        let db = firebase.firestore();
        let courseQ = db.collection('courses').where('author_id', '==', this.props.userObject.uid ).get();
        courseQ.then(snapshot => {
            for(let doc of snapshot.docs) {
                for( let materia of materias ) {
                    if (doc.data().discipline === materia.name) {
                        let courseChildren = [];
                        const childLessonsQ = db.collection('lessons').where('course_id', '==', doc.data().course_id).get();
                        childLessonsQ.then(snapshot => {
                            console.log(snapshot.docs.map(lesson => lesson.data().title))
                            snapshot.docs.map(lesson => {
                                categories.forEach(cat => {
                                    if (lesson.data().category === cat.title && courseChildren.indexOf(cat.title) === -1) {
                                        cat.children.push({title: lesson.data().title})
                                        courseChildren.push({ title: cat.title, children: cat.children });
                                    }
                                });
                            });
                            return snapshot.docs.length
                        })
                        .then((length) => {
                            console.log(length)
                            materia.children.push({
                                title: doc.data().title,
                                description: doc.data().desc,
                                targetAge: doc.data().targetAge,
                                children: courseChildren,
                                lessonCount: length
                            });
                        })
                        .then(() => {
                            this.setState({
                                treeData: materias
                            });
                        })
                        .then(() => this.props.setFoldersData(this.state.treeData))
                    }
                }
            }
        })
    }

    //Deprecated
    getDescendantCount(node) {
        let count = 0;

        if (node.hasOwnProperty('children')) {
            node.children.map(lv1 => {
                if (lv1.hasOwnProperty('children')) {
                    lv1.children.map(lv2 => {
                        if (lv2.hasOwnProperty('children')) {
                            lv2.children.map(lv3 => {
                                count++
                            })
                        } else {
                            count++
                        }
                    })
                } else {
                    count++
                }
            })
        }
        
        return count
    }

    handleDisciplineFilter(e) {
        this.setState({
            disciplineFilter: e.currentTarget.value
        });
    }

    handleAgeFilter(e) {
        this.setState({
            ageFilter: e.currentTarget.value
        });
    }

    getButtonCount(node) {
    const count = this.getDescendantCount(node);
        if (count > 0) {
            return <button className="child-counter">{count}</button>
        }
    }

    renderLessonsView(ageArray) {
        return this.state.view === 'tree' ?
                <LessonsFolder data={this.props.treeData}/>
                :
                <>
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
                    <LessonsListf
                        disciplineFilter={this.state.disciplineFilter}
                        ageFilter={this.state.ageFilter}
                    />
                </>
    }

    render() {
        let ageArray = Array.apply(null, Array(18));
        console.log(this.props)
        return (
            <div className="home-container">
                <Modal modalCondition="isCreateLesson" Component={<CreateLesson/>}/>
                <Modal modalCondition="isCreateCourse" Component={<CreateCourses updateData={this.retrieveFoldersData}/>}/>
                <div className="choose-view-bar">
                    <span onClick={() => this.setState({view: 'tree'})}><FontAwesomeIcon icon={faTree}/></span>
                    <span onClick={() => this.setState({view: 'list'})}><FontAwesomeIcon icon={faListAlt}/></span>
                    <span onClick={this.props.showCLmodal} ><FontAwesomeIcon icon={faPlus}/> Lição</span>
                    <span onClick={this.props.showCCmodal} ><FontAwesomeIcon icon={faPlus}/> Curso</span>
                </div>
                <div className="lessons-container">
                    {this.renderLessonsView(ageArray)}
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user,
    treeData: store.foldersDataReducer.categories
});

const mapDispatchToProps = (dispatch) => ({
    showCLmodal: () => dispatch(showCreateLessonModal()),
    showCCmodal: () => dispatch(showCreateCourseModal()),
    setFoldersData: (data) => dispatch(updateFoldersData(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Lessons)
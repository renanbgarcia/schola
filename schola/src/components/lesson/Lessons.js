import React from 'react';
import { connect } from 'react-redux';
import LessonsFolder from './lessonsFolder';
import firebase from '../../firebase';
import { categories, getMaterias } from '../utils/variables';
import LessonsListf from '../lesson/LessonListf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTree, faListAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { showCreateLessonModal,
         showCreateCourseModal,
         hideCreateLessonModal,
         hideCreateCourseModal } from '../../actions/modalActions';
import { updateFoldersData, requestFoldersData, invalidateFoldersData } from '../../actions/foldersDataAction';
import Modal from '../utils/modal';
import { alertbox } from '../utils/alert';
import CreateLesson from '../lesson/CreateLesson';
import CreateCourses from '../lesson/CreateCourses';
import EditLesson from '../lesson/editLesson';
import EditCourse from '../lesson/editCourse';
import PopMenu from '../utils/popMenu';
import { hidePopMenu, showPopMenu } from '../../actions/menuAction';
import { deleteFolder } from './folderPopMenu';

class Lessons extends React.Component {

    constructor(props) {
        super(props);
        this.retrieveFoldersData = this.retrieveFoldersData.bind(this);
        this.hideEditLesson = this.hideEditLesson.bind(this);
        this.hideEditCourse = this.hideEditCourse.bind(this);
        this.showLessonEdit = this.showLessonEdit.bind(this);
        this.showCourseEdit = this.showCourseEdit.bind(this);
        this.handleCreateLesson = this.handleCreateLesson.bind(this);
        this.handleEditLessonSubmit = this.handleEditLessonSubmit.bind(this);
        this.handleEditCourseSubmit = this.handleEditCourseSubmit.bind(this);
    }

    state = {
        view: 'tree',
        lessons: [],
        disciplineFilter: '',
        ageFilter: '',
        lastDoc: {},
        treeData: [{ title: 'Loading', children: [categories] }],
        isEditLessonOpen: false,
        isEditCourseOpen: false,
        lessonTarget: ''
    }

    optionItems = [
        {title: 'Deletar', onClick: () => {deleteFolder(this.props.popMenuTarget).then(this.retrieveFoldersData())}},
        {title: 'Editar', onClick: () => {
            this.props.popMenuTarget.type === 'lesson' ?
            this.showLessonEdit() : this.showCourseEdit()
        }}
    ]

    // UNSAFE_componentWillMount() {
        
    //     if (!this.props.treeData) {
    //         this.retrieveFoldersData();
    //     } else {
    //         console.log('ja tinha treedata')
    //         console.log(this.props.treeData)
    //     }

    // }

    /**
     * Função a ser passada para um modal para que feche o modal de edição de lição
     */
    hideEditLesson() {
        this.setState({
            isEditLessonOpen: false
        })
    }

    /**
     * Função a ser passada para um modal para que feche o modal de edição de curso
     */
    hideEditCourse() {
        this.setState({
            isEditCourseOpen: false
        })
    }

    /**
     * Função para mostrar modal de edição de lição. É passada como propriedade nas opções do component PopMenu
     */
    showLessonEdit() {
        this.setState({isEditLessonOpen: true})
    }

     /**
     * Função para mostrar modal de edição de curso. É passada como propriedade nas opções do component PopMenu
     */
    showCourseEdit() {
        this.setState({isEditCourseOpen: true})
    }

    /**
     * Necessário para que o o estado dos folder seja atualizado
     */
    resetLocalSorage() {
        localStorage.removeItem('folderState');
    }

    retrieveFoldersData() {
        this.resetLocalSorage();
        this.props.requestFoldersData();
        // let _materias = getMaterias();
        const db = firebase.firestore();
        const courseQ = db.collection('courses').where('author_id', '==', this.props.userObject.uid ).get();
        courseQ.then(snapshot => {
            console.log('atualizando', this.props.userObject.uid, snapshot)
            let _materias = getMaterias();
            if (snapshot.size === 0) {
                this.props.setFoldersData(_materias);
                alertbox.show('Você ainda não possui material. Crie um curso para começar.')
                return
            }
            for(let doc of snapshot.docs) {
                for( let materia of _materias ) {
                    if (doc.data().discipline === materia.name) {
                        let courseChildren = [];
                        materia.lessonCount = materia.lessonCount + 1
                        const childLessonsQ = db.collection('lessons').where('author_id', '==', this.props.userObject.uid).where('course_id', 'array-contains', doc.data().course_id).get();
                        childLessonsQ.then(snapshot => {
                            let innerCategories = categories;
                            for (let cat of innerCategories) {
                                cat.children = []
                                for (let lesson of snapshot.docs) {
                                    if (lesson.data().category === cat.name) {
                                        console.log(lesson.data())
                                        cat.children.push({
                                            title: lesson.data().title,
                                            description: lesson.data().desc,
                                            rating: lesson.data().rating,
                                            dueDate: lesson.data().scheduled,
                                            id: lesson.data().lesson_id,
                                            category: cat.name,
                                            discipline: materia.name,
                                            type: 'lesson'
                                        });                                    
                                    }
                                }
                                if (courseChildren.map(categ => categ.title === cat.title).indexOf(true) === -1) {
                                    courseChildren.push({ title: cat.title, children: cat.children, lessonCount: cat.children.length, name: cat.name, type: 'category' });
                                }
                            }
                            return snapshot.size
                        })
                        .then((count) => {
                            console.log(_materias)
                            materia.children.push({
                                title: doc.data().title,
                                id: doc.data().course_id,
                                description: doc.data().desc,
                                targetAge: doc.data().targetAge,
                                children: courseChildren,
                                lessonCount: count,
                                rating: doc.data().rating,
                                discipline: materia.name,
                                type: 'course'
                            })
                        })
                        console.log(_materias)
                        .then(() => {this.props.setFoldersData(_materias)})
                    }
                }
            }
            this.props.setFoldersData(_materias)
        })
        return
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

    handleCreateLesson() {
        firebase.firestore()
                .collection('courses')
                .where('author_id', '==', this.props.userObject.uid)
                .get()
                .then((snap) => {
                    if (snap.size === 0) {
                        alertbox.show('Você não tem cursos.\n Crie um curso primeiro.')
                    } else {
                        this.props.showCLmodal()
                    }
                })
    }

    renderLessonsView(ageArray) {
        return this.state.view === 'tree' ?
            <LessonsFolder data={this.props.treeData} retrieveFoldersData={this.retrieveFoldersData}/>
            :
            <>
                <label>Idade:</label>
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

    handleEditLessonSubmit() {
        this.hideEditLesson()
        this.retrieveFoldersData();
    }

    handleEditCourseSubmit() {
        this.hideEditCourse()
        this.retrieveFoldersData();
    }

    render() {
        console.log(this.props.popMenuTarget)
        let ageArray = Array.apply(null, Array(18));
        return (
            <div className="home-container">
                <Modal isOpen={this.state.isEditLessonOpen} hideFunc={this.hideEditLesson} componentName="EditLesson">
                    <EditLesson lessonId={this.props.popMenuTarget.id} updateData={this.handleEditLessonSubmit}/>
                </Modal>
                <Modal isOpen={this.state.isEditCourseOpen} hideFunc={this.hideEditCourse} componentName="EditCourse">
                    <EditCourse courseId={this.props.popMenuTarget.id} updateData={this.handleEditCourseSubmit}/>
                </Modal>
                <div className="choose-view-bar">
                    <span onClick={() => this.setState({view: 'tree'})}><FontAwesomeIcon icon={faTree}/></span>
                    <span onClick={() => this.setState({view: 'list'})}><FontAwesomeIcon icon={faListAlt}/></span>
                    {/* <span onClick={this.handleCreateLesson} ><FontAwesomeIcon icon={faPlus}/> Lição</span>
                    <span onClick={this.props.showCCmodal} ><FontAwesomeIcon icon={faPlus}/> Curso</span> */}
                </div>
                <div className="lessons-container">
                    {this.renderLessonsView(ageArray)}
                </div>
                <div onClick={this.props.hidePopMenu}>
                <PopMenu show={this.props.isPopMenuVisible}
                        hideFunc={this.props.hidePopMenu}
                        items={this.optionItems}
                        target={this.props.popMenuTarget}
                        x={this.props.popMenuX}
                        y={this.props.popMenuY}/>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    userObject: store.authReducer.user,
    treeData: store.foldersDataReducer.categories,
    isPopMenuVisible: store.menuReducer.isPopMenuVisible,
    popMenuX: store.menuReducer.popMenuPositionX,
    popMenuY: store.menuReducer.popMenuPositionY,
    popMenuTarget: store.menuReducer.popMenuTarget
});

const mapDispatchToProps = (dispatch) => ({
    setFoldersData: (data) => dispatch(updateFoldersData(data)),
    requestFoldersData: () => dispatch(requestFoldersData()),
    invalidateFoldersData: () => dispatch(updateFoldersData()),
    hidePopMenu: () => dispatch(hidePopMenu()),
    showPopMenu: () => dispatch(showPopMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Lessons)
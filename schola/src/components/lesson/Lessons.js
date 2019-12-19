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
import { updateFoldersData } from '../../actions/foldersDataAction';
import Modal from '../utils/modal';
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
    }

    state = {
        view: 'tree',
        lessons: [],
        disciplineFilter: '',
        ageFilter: '',
        lastDoc: {},
        treeData: [{ title: 'Loading', children: [] }],
        isEditLessonOpen: false,
        lessonTarget: ''
    }

    optionItems = [
        {title: 'Deletar', onClick: () => {deleteFolder(this.props.popMenuTarget); this.retrieveFoldersData()}},
        {title: 'Editar', onClick: () => {
            this.props.popMenuTarget.type === 'lesson' ?
            this.showLessonEdit() : this.showCourseEdit()
        }}
    ]

    UNSAFE_componentWillMount() {
        this.retrieveFoldersData();
    }

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

    retrieveFoldersData() {
        const db = firebase.firestore();
        const courseQ = db.collection('courses').where('author_id', '==', this.props.userObject.uid ).get();
        courseQ.then(snapshot => {
            let _materias = getMaterias();
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
                                    if (lesson.data().category === cat.title) {
                                        console.log(lesson.data())
                                        cat.children.push({
                                            title: lesson.data().title,
                                            description: lesson.data().desc,
                                            rating: lesson.data().rating,
                                            dueDate: lesson.data().scheduled,
                                            id: lesson.data().lessonId,
                                            type: 'lesson'
                                        });                                    
                                    }
                                }
                                if (courseChildren.map(categ => categ.title === cat.title).indexOf(true) === -1) {
                                    courseChildren.push({ title: cat.title, children: cat.children, lessonCount: cat.children.length, type: 'category' });
                                }
                            }
                            return snapshot.size
                        })
                        .then((count) => {
                            console.log(materia)
                            materia.children.push({
                                title: doc.data().title,
                                id: doc.data().course_id,
                                description: doc.data().desc,
                                targetAge: doc.data().targetAge,
                                children: courseChildren,
                                lessonCount: count,
                                rating: doc.data().rating,
                                type: 'course'
                            })
                        })
                        .then(() => this.props.setFoldersData(_materias))
                    }
                }
            }
        })
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

    renderLessonsView(ageArray) {
        return this.state.view === 'tree' ?
            <LessonsFolder data={this.props.treeData}/>
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

    render() {
        let ageArray = Array.apply(null, Array(18));
        return (
            <div className="home-container">
                <Modal isOpen={this.props.isCreateLessonOpen} hideFunc={this.props.hideCLModal} Component={<CreateLesson/>}/>
                <Modal isOpen={this.state.isEditLessonOpen} hideFunc={this.hideEditLesson} Component={<EditLesson lessonId={this.props.popMenuTarget.id}/>}/>
                <Modal isOpen={this.state.isEditCourseOpen} hideFunc={this.hideEditCourse} Component={<EditCourse courseId={this.props.popMenuTarget.id}/>}/>
                <Modal isOpen={this.props.isCreateCourseOpen} hideFunc={this.props.hideCCModal} Component={<CreateCourses updateData={this.retrieveFoldersData}/>}/>
                <div className="choose-view-bar">
                    <span onClick={() => this.setState({view: 'tree'})}><FontAwesomeIcon icon={faTree}/></span>
                    <span onClick={() => this.setState({view: 'list'})}><FontAwesomeIcon icon={faListAlt}/></span>
                    <span onClick={this.props.showCLmodal} ><FontAwesomeIcon icon={faPlus}/> Lição</span>
                    <span onClick={this.props.showCCmodal} ><FontAwesomeIcon icon={faPlus}/> Curso</span>
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
    isCreateLessonOpen: store.modalReducer.isCLOpen,
    isCreateCourseOpen: store.modalReducer.isCCOpen,
    isPopMenuVisible: store.menuReducer.isPopMenuVisible,
    popMenuX: store.menuReducer.popMenuPositionX,
    popMenuY: store.menuReducer.popMenuPositionY,
    popMenuTarget: store.menuReducer.popMenuTarget
});

const mapDispatchToProps = (dispatch) => ({
    showCLmodal: () => dispatch(showCreateLessonModal()),
    showCCmodal: () => dispatch(showCreateCourseModal()),
    hideCLModal: () => dispatch(hideCreateLessonModal()),
    hideCCModal: () => dispatch(hideCreateCourseModal()),
    setFoldersData: (data) => dispatch(updateFoldersData(data)),
    hidePopMenu: () => dispatch(hidePopMenu()),
    showPopMenu: () => dispatch(showPopMenu()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Lessons)
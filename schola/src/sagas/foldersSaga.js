
    import { categories, getMaterias } from '../components/utils/variables';
    import { UPDATE_FOLDERS_DATA, REQUEST_FOLDERS_DATA } from '../actions/types';
    import firebase from '../firebase';
    import { alertbox } from '../components/utils/alert';
    import { call, select, put, take, takeEvery } from 'redux-saga/effects';

    function* retrieve() {
        const userId = yield select((state) => {console.log(state); return state.authReducer.user.uid})

        const db = firebase.firestore();
        let courses = yield db.collection('courses').where('author_id', '==', userId ).get()
        .then(snapshot => snapshot.docs);

        let _materias = getMaterias();
        if (courses.length === 0) {
            this.props.setFoldersData(_materias);
            alertbox.show('Você ainda não possui material. Crie um curso para começar.')
            return _materias
        }
        for (let doc of courses) {
            for ( let materia of _materias ) {
                if (doc.data().discipline === materia.name) {
                    let courseChildren = [];
                    materia.lessonCount = materia.lessonCount + 1
                    let childLessonsQ = yield db.collection('lessons').where('author_id', '==', userId).where('course_id', 'array-contains', doc.data().course_id).get()
                    .then(snapshot => {
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
                        return {count: snapshot.size, materia: materia, courseChildren: courseChildren}
                    })

                    materia.children.push({
                        title: doc.data().title,
                        id: doc.data().course_id,
                        description: doc.data().desc,
                        targetAge: doc.data().targetAge,
                        children: childLessonsQ.courseChildren,
                        lessonCount: childLessonsQ.count,
                        rating: doc.data().rating,
                        discipline: childLessonsQ.materia.name,
                        type: 'course'
                    })
                }
            }
        }

        console.log(_materias, 'aqui')

        yield put({type: UPDATE_FOLDERS_DATA, items: _materias})
    }

export default function* foldersSaga() {
    try {

        yield takeEvery(REQUEST_FOLDERS_DATA, retrieve);
        console.log('fodlersSAGAAAA')      

    } catch (e) {
        console.log(e)
    }

}
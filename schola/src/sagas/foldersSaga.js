
    import { categories, getMaterias } from '../components/utils/variables';
    import firebase from '../firebase';
    import { call, select, put, take } from 'redux-saga/effects';


    const retrieveFoldersData = async (userID) => {
        // this.resetLocalSorage();
        // this.props.requestFoldersData();
        // let _materias = getMaterias();
        const db = firebase.firestore();
        const courseQ = await db.collection('courses').where('author_id', '==', userID ).get()
        .then(snapshot => async () => {
            return await loopCourses(snapshot);
        })
        return courseQ
    }

    const loopCourses = async (snapshot) => {
        console.log('atualizando', this.props.userObject.uid, snapshot)
        let _materias = getMaterias();
        if (snapshot.size === 0) {
            this.props.setFoldersData(_materias);
            // alertbox.show('Você ainda não possui material. Crie um curso para começar.')
            return
        }
        for await (let doc of snapshot.docs) {
            for await ( let materia of _materias ) {
                if (doc.data().discipline === materia.name) {
                    let courseChildren = [];
                    materia.lessonCount = materia.lessonCount + 1
                    await getLessons(materia, courseChildren, doc)
                    .then((res) => {
                        res().then((data) => {
                            console.log(_materias)
                            console.log(res)
                            console.log(doc.data())
                            console.log(data)
                            materia.children.push({
                                title: doc.data().title,
                                id: doc.data().course_id,
                                description: doc.data().desc,
                                targetAge: doc.data().targetAge,
                                children: data.courseChildren,
                                lessonCount: data.count,
                                rating: doc.data().rating,
                                discipline: data.materia.name,
                                type: 'course'
                            })
                        })
                    })
                }
            }
        }
        return _materias
    }

    const getLessons = async (materia, courseChildren, doc) => {
        const db = firebase.firestore();
        const childLessonsQ = db.collection('lessons').where('author_id', '==', this.props.userObject.uid).where('course_id', 'array-contains', doc.data().course_id).get()
        .then(snapshot => async () => {
            let innerCategories = categories;
            for await (let cat of innerCategories) {
                cat.children = []
                for await (let lesson of snapshot.docs) {
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
        return childLessonsQ
    }

export default function* foldersSaga() {
    try {

        yield take('REQUEST_FOLDERS_DATA');

        const userId = yield select((state) => state.user.id)

        const foldersData = yield call(retrieveFoldersData(userId))

        yield put({type: 'UPDATE_FOLDERS_DATA', items: foldersData})

    } catch (e) {
        console.log(e)
    }

}
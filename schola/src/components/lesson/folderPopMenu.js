import firebase from '../../firebase';

export const optionItems = [
    {title: 'Deletar', onClick: () => alert(this.props.popMenuTarget.type)},
    {title: 'Editar', onClick: () => alert('edita')}
]

export const deleteFolder = async (folder) => {
    const db = firebase.firestore();
    try {
        if (folder.hasOwnProperty('type')) {
            db.collection(`${folder.type}s`).doc(folder.id).delete();
            if (folder.type === 'lesson') {
                db.collection('events')
                   .where('lesson_id', '==', folder.id)
                   .get()
                   .then(snap => {
                        snap.docs.forEach(doc => db.collection('events').doc(doc.data().id).delete());
                    })
            }
        }

    } catch (err) {
        console.log(err.messsage)
        throw err;
    }

    return
}


export const deleteLesson = (id) => {
    const db = firebase.firestore();
    try {
            db.collection('lessons').doc(id).delete();
            db.collection('events')
                .where('lesson_id', '==', id)
                .get()
                .then(snap => {
                    snap.docs.forEach(doc => db.collection('events').doc(doc.data().id).delete());
                })
    } catch (err) {
        console.log(err.messsage)
        throw err;
    }
}
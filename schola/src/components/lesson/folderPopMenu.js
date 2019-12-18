import firebase from '../../firebase';

export const optionItems = [
    {title: 'Deletar', onClick: () => alert(this.props.popMenuTarget.type)},
    {title: 'Editar', onClick: () => alert('edita')}
]

export const deleteFolder = (folder) => {
    const db = firebase.firestore();
    try {
        if (folder.hasOwnProperty('type')) {
            db.collection(`${folder.type}s`).doc(folder.id).delete();
        }

    } catch (err) {
        console.log(err.messsage)
        throw err;
    }
}
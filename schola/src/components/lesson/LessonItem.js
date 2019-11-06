import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';

const LessonItem = (props) => {
    let index = props.index;
    let content = props.list[index];
    if (!content) {
        return <div>Nada</div>
    }
    const deleteLesson = props.deleteLesson;
    const title = content.title;
    const style = props.style;
    const age = content.targetAge;
    const createdAt = content.created_at.toDate().toLocaleDateString("pt-BR");
    const discipline = content.discipline;
    // const files = content.filesURLs ? content.filesURLs.map(file => <span>{file}</span>) : 0;
    const files = content.filesURLs ? content.filesURLs.length : 0;
        let table = <tr style={style} className="listView-item-container observed">
                        <td className="title"><strong>{title}</strong></td>
                        {/* <td>{description}</td> */}
                        <td>{files}</td>
                        <td>{age} </td>
                        <td>{discipline} </td>
                        <td >{createdAt} </td>
                        <td className="close-btn" onClick={() => deleteLesson(content.lessonId)} ><FontAwesomeIcon icon={faWindowClose}/></td>
                    </tr>
    return (
        <>{table}</>
    )
}

export default LessonItem
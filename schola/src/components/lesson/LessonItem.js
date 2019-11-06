import React from 'react';

const LessonItem = (props) => {
    let index = props.index;
    let content = props.list[index];
    if (!content) {
        return <div>Nada</div>
    }
    console.log(content)
    const title = content.title;
    const description = content.desc;
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
                    </tr>
    return (
        <>{table}</>
    )
}

export default LessonItem
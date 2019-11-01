import React from 'react';
import { Link } from 'react-router-dom';

const HomeLessonItem = (props) => {
    let index = props.index;
    let content = props.list[index];
    if (!content) {
        return <div>Nada</div>
    }
    const photo = content.authorProto
    const title = content.title;
    const description = content.desc;
    const style = props.style;
    let item = <div style={style} className="listView-item-container observed">
                    <div id={'sel' + index} className="List" >
                        <img src={photo} title={content.author} className="list-author-photo"/>
                        <div className="listview-content-container">
                            <p><strong>{title}</strong></p>
                            <p>{description}</p>
                            <div className="files-preview-container">
                                {previewFiles(content, index)}
                            </div>
                        </div>
                    </div>
                </div>
    return (
        <>{item}</>
    )
}

const previewFiles = (content, index) => {
    if (content.filesURLs) {
        let className;
        if (content.filesURLs.length > 1) {
            className = 'list-image list-image-multiple';
        } else {
            className = 'list-image';
        }

        let elem = content.filesURLs.slice(0, 3).map(src => <img key={(index + 1) * Math.random()} className={className} src={src} alt={content.title}/>);
        if (content.filesURLs.length > 3) {
            elem.push(<Link href={'#'} className="and-more">... e mais</Link>);
        }
        return elem
    }
}

export default HomeLessonItem
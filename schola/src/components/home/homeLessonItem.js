import React from 'react';
import { Link } from 'react-router-dom';
import FilePreviewer from '../utils/previewers/FilePreviewer';
import {_history} from '../../App';

// import firebase from '../../firebase';

class HomeLessonItem  extends React.Component {

    constructor(props) {
        super(props);
        this.previewFiles = this.previewFiles.bind(this);
    }

    previewFiles = (content, index) => {
        if (content.filesURLs) {
            let className;
            if (content.filesURLs.length > 1) {
                className = 'list-image list-image-multiple';
            } else {
                className = 'list-image';
            }

            let elem = <div className="previewer-wrapper">
                        { content.filesURLs.slice(0, 3).map(file => {
                            if (!file.url) {
                                return null
                            }
                            return <div className={className}>   
                                        <a href={file.url}>
                                            <div className="file-wrapper">
                                                <FilePreviewer files={[file]}/>
                                            </div>
                                        </a>
                                   </div>
                        }) }
                    </div>
            // }

            if (content.filesURLs.length > 3) {
                elem.push(<Link href={'#'} className="and-more">... e mais</Link>);
            }

            return elem
    
        // let elem = content.filesURLs.slice(0, 3).map(src => {console.log(src); return <img key={(index + 1) * Math.random()} className={className} src={src.url} alt={src.name}/>});
        //     if (content.filesURLs.length > 3) {
        //         elem.push(<Link href={'#'} className="and-more">... e mais</Link>);
        //     }
        //     return elem
        }
    }

    render() {
        let index = this.props.index;
        let content = this.props.list[index];
        if (!content) {
            return <div>Nada</div>
        }
        const photo = content.authorPhoto
        const title = content.title;
        const description = content.desc;
        const style = this.props.style;
        console.log(content, 'content')
        return (
                <div style={style} className="listView-item-container observed">
                    <div className="listview-content-wrapper">
                        <div id={'sel' + index} className="list" >
                            <div className="list-author-photo-wrapper">
                                <img src={photo} alt="" title={content.author} className="list-author-photo"/>
                            </div>
                            <div className="listview-content-container">
                                <p><strong><span className="list-title">{title}</span></strong></p>
                                <div className="listview-description">{description}</div>
                                <div className="files-preview-container">
                                    {this.previewFiles(content, index)}
                                </div>
                            </div>

                        </div>
                        <div className="listview-bar">
                            <Link to={'/lessonpage/' + content.lesson_id}>Ver</Link>
                        </div>
                    </div>
                </div>
        )
    }
}

export default HomeLessonItem
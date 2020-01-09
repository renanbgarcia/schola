import React from 'react';
import { Link } from 'react-router-dom';
// import firebase from '../../firebase';

class HomeLessonItem  extends React.Component {

    constructor(props) {
        super(props);
        this.previewFiles = this.previewFiles.bind(this);
    }

    // state = {
    //     authorPhoto: ''
    // }

    // UNSAFE_componentWillReceiveProps() {
    //     firebase.firestore().collection('users').doc(this.props.list[this.props.index].author_id).get().then(doc => this.setState({authorPhoto: doc.data().photoURL}))
    // }

    previewFiles = (content, index) => {
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
        return (
                <div style={style} className="listView-item-container observed">
                    <div id={'sel' + index} className="list" >
                        <div className="list-author-photo-wrapper">
                            <img src={photo} alt="" title={content.author} className="list-author-photo"/>
                        </div>
                        <div className="listview-content-container">
                            <p><strong><span className="list-title">{title}</span></strong></p>
                            <p>{description}</p>
                            <div className="files-preview-container">
                                {this.previewFiles(content, index)}
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

export default HomeLessonItem

// const HomeLessonItem = (props) => {
//     let index = props.index;
//     let content = props.list[index];
//     if (!content) {
//         return <div>Nada</div>
//     }
//     console.log(content)
//     firebase.firestore().collection('users').doc(content.author_id).get().then(snap => )
//     const photo = content.authorPhoto
//     const title = content.title;
//     const description = content.desc;
//     const style = props.style;
//     let item = <div style={style} className="listView-item-container observed">
//                     <div id={'sel' + index} className="list" >
//                         <img src={photo} title={content.author} className="list-author-photo"/>
//                         <div className="listview-content-container">
//                             <p><strong><span className="list-title">{title}</span></strong></p>
//                             <p>{description}</p>
//                             <div className="files-preview-container">
//                                 {previewFiles(content, index)}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//     return (
//         <>{item}</>
//     )
// }

// const previewFiles = (content, index) => {
//     if (content.filesURLs) {
//         let className;
//         if (content.filesURLs.length > 1) {
//             className = 'list-image list-image-multiple';
//         } else {
//             className = 'list-image';
//         }

//         let elem = content.filesURLs.slice(0, 3).map(src => <img key={(index + 1) * Math.random()} className={className} src={src} alt={content.title}/>);
//         if (content.filesURLs.length > 3) {
//             elem.push(<Link href={'#'} className="and-more">... e mais</Link>);
//         }
//         return elem
//     }
// }
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faCalendarAlt, faStar, faEllipsisV } from '@fortawesome/free-solid-svg-icons';

class Folder extends React.Component {

    state = {
        showMenuOptions: false
    }

    getDate = (timestamp) => {
        let d = new Date(timestamp.seconds * 1000);
        return d.toLocaleDateString();
    }

    renderBar(folder) {
        let countIcon;
        switch (folder.type) {
            case 'category':
                countIcon = faBookOpen;
                break;
            case 'course':
                countIcon = faBookOpen;
                break;
            default:
                countIcon = faBook;
                break;
        }

        return (
            <div className="lesson-folder-bar">
                <div>
                    { folder.hasOwnProperty('lessonCount') ?
                        <span><FontAwesomeIcon icon={countIcon}/> {folder.lessonCount}</span>
                        :
                        null
                    }
                </div>
                {   
                    folder.hasOwnProperty('dueDate') && folder.dueDate !== undefined?
                    <div>
                        <span><FontAwesomeIcon icon={faCalendarAlt}/> </span>
                        {folder.dueDate.map(scl => <span> { this.getDate(scl.start) } </span>)}
                    </div>
                    :
                    null
                }
                {   
                    folder.hasOwnProperty('rating') && folder.rating !== undefined?
                    <div>
                        <span><FontAwesomeIcon icon={faStar}/> {folder.rating}</span>
                    </div>
                    :
                    null
                }
                <div className="circle-item-menu" onClick={(e) => this.handleOptionsClick(e)}><FontAwesomeIcon icon={faEllipsisV}/></div>
                {
                    this.state.showMenuOptions ?
                    <div style={{position: 'absolute', top: this.state.menuOptionsPos.y, left: this.state.menuOptionsPos.x}}>Menuzin</div>
                    :
                    null
                }
            </div>
        )
    }

    handleOptionsClick(e) {
        e.preventDefault();
        console.log(e.clientX, e.clientY);
        this.setState({
            showMenuOptions: true,
            menuOptionsPos: {x: e.offsetX, y: e.offsetY}
        })
    }

    render() {
        const folder = this.props.folder;
        console.log(folder)
        return (
            <div className="lessons-folder-item " onClick={this.props.onClick} id={"item-" + folder.id} >
                <div className="lesson-folder-content">
                    <div className="lessons-folder-title">{ folder.title }</div>
                    <div className="lessons-folder-description">{ folder.description }</div>
                    {this.renderBar(folder)}
                </div>

            </div>
        )
    }
}

export default Folder;
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faBookOpen, faCalendarAlt, faStar, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import PopMenu, { offset } from '../utils/popMenu';
import { connect } from 'react-redux';
import { hidePopMenu, showPopMenu, updatePopMenuPosition, updatePopMenuTarget } from '../../actions/menuAction';
import Modal from '../utils/modal';

class Folder extends React.Component {

    state = {
        menuOptionsPos: {
            x: 0,
            y: 0
        }
    }

    getDate = (timestamp) => {
        console.log(timestamp)
        let d = new Date(timestamp);
        return d.toLocaleDateString();
    }

    renderBar(folder) {
        console.log(folder)
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
                        {/* {folder.dueDate.map(scl => <span> { this.getDate(scl.start) } </span>)} */}
                        {<span> { this.getDate(folder.dueDate) } </span>}
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
                {
                    folder.hasOwnProperty('type') && folder.type !== 'category' ? //se é category quer dizer que é course ou lesson
                    <div className="circle-item-menu" onClick={(e) => {
                            this.handleOptionsClick(e); this.props.updatePopMenuTarget(folder)
                        }}><FontAwesomeIcon icon={faEllipsisV}/>
                    </div>
                    :
                    null
                }
            </div>
        )
    }

    handleOptionsClick(e) {
        e.preventDefault();
        console.log(offset(e.target))
        const t = offset(e.target).top;
        const l = offset(e.target).left;
        this.props.updatePopMenuPos(l - 100, t + 5);
        this.props.showPopMenu();
    }

    render() {
        const folder = this.props.folder;
        console.log(folder)
        return (
            <div className="lessons-folder-item "  id={"item-" + folder.id} >
                <div className="lesson-folder-content" onClick={this.props.onClick}>
                    <div className="lessons-folder-title">{ folder.title }</div>
                    <div className="lessons-folder-description">{ folder.description }</div>

                </div>
                {this.renderBar(folder)}
                
            </div>
        )
    }
}

const mapStateToProps = (store) => ({
    isPopMenuVisible: store.menuReducer.isPopMenuVisible
})

const mapDispatchToProps = (dispatch) => ({
    hidePopMenu: () => dispatch(hidePopMenu()),
    showPopMenu: () => dispatch(showPopMenu()),
    updatePopMenuPos: (x, y) => dispatch(updatePopMenuPosition(x, y)),
    updatePopMenuTarget: (target) => dispatch(updatePopMenuTarget(target))
})

export default connect(mapStateToProps, mapDispatchToProps)(Folder);
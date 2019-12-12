import React from 'react';

class Folder extends React.Component {

    getDate = (timestamp) => {
        let d = new Date(timestamp.seconds * 1000);
        return d.toLocaleDateString();
    }

    renderBar(folder) {
        return (
            <div className="lesson-folder-bar">
                <div>
                    { folder.hasOwnProperty('lessonCount') ? "Lições: " + folder.lessonCount : null }
                </div>
                {   
                    folder.hasOwnProperty('dueDate') && folder.dueDate !== undefined?
                    <div>
                        <span>Agendado: </span>
                        {folder.dueDate.map(scl => <span>  { this.getDate(scl.start) }  </span>)}
                    </div>
                    :
                    null
                }
            </div>
        )
    }

    render() {
        const folder = this.props.folder;
        console.log(folder)
        return (
            <div className="lessons-folder-item" onClick={this.props.onClick} id={"item-" + folder.id} >
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
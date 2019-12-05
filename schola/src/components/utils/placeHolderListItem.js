import React from 'react';

const ListItemPlaceholder = (props) => {
    return (
        <div style={props.style} className="listView-item-container">
            <div className="list" >
                <div className="listview-content-container">
                    <div className="placeholder-div">
                        <div className="cylon-eye"></div>
                    </div>
                    <div className="placeholder-div">
                        <div className="cylon-eye"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ListItemPlaceholder;
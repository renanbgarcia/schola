import React from 'react';

class Sidebar extends React.Component {
    state = {
        isOpen: false
    }

    render() {
        return (
            <div className="sidebar">Sidebar</div>
        )
    }
}

export default Sidebar;
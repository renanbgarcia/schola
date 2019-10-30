import React from 'react';
import { menuContent } from './menuContent';


class SidebarFixed extends React.Component {

    render() {
        return (
            <div className="sidebar-fixed">{menuContent()}</div>
        )
    }
}

export default SidebarFixed;
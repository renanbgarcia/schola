import React from 'react';
import  { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faStickyNote, faPlusSquare } from '@fortawesome/free-solid-svg-icons'

export const menuContent = () => {
    return (
        <ul className="menu-content">
            <Link to="/"><li><FontAwesomeIcon icon={faHome}/> Home</li></Link>
            <Link to="/lessons"><li><FontAwesomeIcon icon={faStickyNote}/> Lições</li></Link>
            <Link to="/create/lesson"><li><FontAwesomeIcon icon={faPlusSquare}/> Criar lições</li></Link>
        </ul>
    )
}
import React from 'react';
import  { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faStickyNote, faPlusSquare, faUserGraduate, faUser } from '@fortawesome/free-solid-svg-icons'

export const menuContent = () => {
    return (
        <ul className="menu-content">
            <Link to="/"><li><FontAwesomeIcon icon={faHome} size="2x"/> <span>Home</span></li></Link>
            <Link to="/lessons"><li><FontAwesomeIcon icon={faStickyNote} size="2x"/> <span>Lições</span></li></Link>
            <Link to="/create/lesson"><li><FontAwesomeIcon icon={faPlusSquare} size="2x"/> <span>Criar lições</span></li></Link>
            <Link to="/profile"><li><FontAwesomeIcon icon={faUser} size="2x"/> <span>Perfil</span></li></Link>
        </ul>
    )
}
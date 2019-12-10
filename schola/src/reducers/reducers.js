import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import { firebaseReducer } from "react-redux-firebase";
import menuReducer from './menuReducer';
import modalReducer from './modalReducer';
import foldersDataReducer from './foldersDataReducer';

const reducers = combineReducers({
    authReducer,
    firebaseReducer,
    menuReducer,
    modalReducer,
    foldersDataReducer
  });

export default reducers;
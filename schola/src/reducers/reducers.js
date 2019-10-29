import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import { firebaseReducer } from "react-redux-firebase";
import menuReducer from './menuReducer';

const reducers =  combineReducers({
    authReducer,
    firebaseReducer,
    menuReducer
  });

export default reducers;
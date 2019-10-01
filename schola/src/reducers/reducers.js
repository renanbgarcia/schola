import { combineReducers } from 'redux';
import getUserReducer from './userReducer';
import authReducer from "./authReducer";
import { firebaseReducer } from "react-redux-firebase";

const reducers = combineReducers({
    getUser: getUserReducer,
    authReducer,
    firebaseReducer
  });

export default reducers;
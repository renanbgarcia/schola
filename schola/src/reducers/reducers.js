import { combineReducers } from 'redux';
import authReducer from "./authReducer";
import { firebaseReducer } from "react-redux-firebase";

const reducers =  combineReducers({
    authReducer,
    firebaseReducer
  });

export default reducers;
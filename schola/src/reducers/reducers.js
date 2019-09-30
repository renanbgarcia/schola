import { combineReducers } from 'redux';
import getUserReducer from './userReducer';

const reducers = combineReducers({
    userState: getUserReducer
  });

export default reducers;
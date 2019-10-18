import { SIGNIN_SUCCESS, SIGNOUT_SUCCESS } from '../actions/types';

const initialState = {
    currentUser: 'Loading'
  };

function authReducer(state = initialState, action) {
    if (action.type === SIGNIN_SUCCESS) {
      console.log(action.user);
      return Object.assign({}, state, {
          currentUser: action.user.email,
          user: action.user,
          isLogged: true
      })
    }
    else if (action.type === SIGNOUT_SUCCESS) {
      console.log(action.user);
      return Object.assign({}, state, {
          currentUser: action.user,
          user: action.user,
          isLogged: false
      })
    }
    return state;
};

export default authReducer;
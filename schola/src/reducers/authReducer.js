import { SIGNIN_SUCCESS } from '../actions/types';

const initialState = {
    currentUser: 'Loading'
  };

function userSignedIn(state = initialState, action) {
    if (action.type === SIGNIN_SUCCESS) {
        console.log(action.user);
        return Object.assign({}, state, {
            currentUser: action.user.email,
            isLogged: true
        })
      }
    return state;
};

export default userSignedIn;
import { GET_USER } from '../actions/types';

const initialState = {
    currentUser: 'Jonas C'
  };

function getUserReducer(state = initialState, action) {
    if (action.type === GET_USER) {
        return Object.assign({}, state, {
            currentUser: action.nome
          })
      }
    return state;
};

export default getUserReducer;
import { GET_USER } from '../actions/types';

const initialState = {
    currentUser: { nome: 'nada'}
  };

function getUserReducer(state = initialState, action) {
    if (action.type === GET_USER) {
        Object.assign({}, state, {
            currentUser: action.payload.nome
          })
      }
    return state;
};

export default getUserReducer;
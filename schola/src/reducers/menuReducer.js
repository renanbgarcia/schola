import { SHOW_MENU, HIDE_MENU } from '../actions/types';

const initialState = {
    isMenuVisible: true
  };

function menuReducer(state = initialState, action) {
    if (action.type === SHOW_MENU) {
        console.log('show menu')
      return Object.assign({}, state, {
        isMenuVisible: true
      })
    }
    else if (action.type === HIDE_MENU) {
        console.log('hide menu')
      return Object.assign({}, state, {
        isMenuVisible: false
      })
    }
    return state;
};

export default menuReducer;
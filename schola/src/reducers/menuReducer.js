import { SHOW_MENU,
        HIDE_MENU,
        HIDE_POPMENU,
        SHOW_POPMENU,
        UPDATE_POPMENU_POSITION,
        UPDATE_POPMENU_TARGET } from '../actions/types';

const initialState = {
    isMenuVisible: true,
    isPopMenuVisible: false,
    popMenuTarget: ""
  };

function menuReducer(state = initialState, action) {
    if (action.type === SHOW_MENU) {
      return Object.assign({}, state, {
        isMenuVisible: true
      })
    }
    else if (action.type === HIDE_MENU) {
      return Object.assign({}, state, {
        isMenuVisible: false
      })
    }
    else if (action.type === HIDE_POPMENU) {
      return Object.assign({}, state, {
        isPopMenuVisible: false
      })
    }
    else if (action.type === SHOW_POPMENU) {
      return Object.assign({}, state, {
        isPopMenuVisible: true
      })
    }
    else if (action.type === UPDATE_POPMENU_POSITION) {
      return Object.assign({}, state, {
        popMenuPositionX: action.popMenuPositionX,
        popMenuPositionY: action.popMenuPositionY
      })
    }
    else if (action.type === UPDATE_POPMENU_TARGET) {
      return Object.assign({}, state, {
        popMenuTarget: action.popMenuTarget
      })
    }
    return state;
};

export default menuReducer;
import { HIDE_CREATELESSON_MODAL, SHOW_CREATELESSON_MODAL, HIDE_CREATECOURSE_MODAL, SHOW_CREATECOURSE_MODAL } from '../actions/types';

const initialState = {
    isCLOpen: false,
    isCCOpen: false
  };

function modalReducer(state = initialState, action) {
    if (action.type === HIDE_CREATELESSON_MODAL) {
      console.log("hide m");
      return Object.assign({}, state, {
          isCLOpen: action.isOpen
      })
    }
    else if (action.type === SHOW_CREATELESSON_MODAL) {
      console.log("show m");
      return Object.assign({}, state, {
          isCLOpen: action.isOpen
      })
    } else if (action.type === HIDE_CREATECOURSE_MODAL) {
      console.log("hide m");
      return Object.assign({}, state, {
          isCCOpen: action.isOpen
      })
    }
    else if (action.type === SHOW_CREATECOURSE_MODAL) {
      console.log("show m");
      return Object.assign({}, state, {
          isCCOpen: action.isOpen
      })
    }
    return state;
};

export default modalReducer;
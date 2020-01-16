import { UPDATE_FOLDERS_DATA, UPDATE_ACTUAL_VIEW, REQUEST_FOLDERS_DATA, INVALIDATE_FOLDERS_DATA } from '../actions/types';

const initialState = {
    // categories: [{title: "Loading", children: []}],
    // actualView: [{title: "Loading", children: [{title: "Loading"},{title: "Loading"},{title: "Loading"}]}],
    isFetching: true,
    didInvalidate: false,
    categories: [{title: "Loading", children: [{title: "Loading"},{title: "Loading"},{title: "Loading"}]}]
  };

function foldersDataReducer(state = initialState, action) {
    if (action.type === UPDATE_FOLDERS_DATA) {
        console.log('finished fetch')
        return Object.assign({}, state, {
            isFetching: false,
            didInvalidate: false,
            categories: action.items,
          })
    }
    if (action.type === REQUEST_FOLDERS_DATA) {
        console.log('begin fetch')
        return Object.assign({}, state, {
            isFetching: true,
            didInvalidate: false
          })
    }
    if (action.type === INVALIDATE_FOLDERS_DATA) {
        return Object.assign({}, state, {
            didInvalidate: true,
            isFetching: false
          })
    }
    return state;
};

export default foldersDataReducer;
import { UPDATE_FOLDERS_DATA, UPDATE_ACTUAL_VIEW } from '../actions/types';

const initialState = {
    categories: [{title: "Loading", children: []}],
    actualView: [{title: "Loading", children: [{title: "Loading"},{title: "Loading"},{title: "Loading"}]}]
  };

function foldersDataReducer(state = initialState, action) {
    if (action.type === UPDATE_FOLDERS_DATA) {
        return Object.assign({}, state, {
            categories: action.categories
          })
    }
    else if (action.type === UPDATE_ACTUAL_VIEW) {
        return Object.assign({}, state, {
            actualView: action.actualView
        })
    }
    return state;
};

export default foldersDataReducer;
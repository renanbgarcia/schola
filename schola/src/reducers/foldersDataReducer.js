import { UPDATE_FOLDERS_DATA } from '../actions/types';

const initialState = {
    categories: [{title: "Loading", children: []}]
  };

function foldersDataReducer(state = initialState, action) {
    if (action.type === UPDATE_FOLDERS_DATA) {
        return Object.assign({}, state, {
            categories: action.categories
          })
    }
    return state;
};

export default foldersDataReducer;
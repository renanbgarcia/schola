import { SIGNIN_SUCCESS } from '../actions/types';
import firebase from  './../firebase';

const initialState = {
    currentUser: 'Loading'
  };

function userSignedIn(state = initialState, action) {
    if (action.type === SIGNIN_SUCCESS) {
        // firebase.auth().signInWithEmailAndPassword(action.email, action.password)
        // .then((res) => {
        //     console.log(res);
        //     firebase.auth().onAuthStateChanged(user => {
        //         console.log(user);
        //         return Object.assign({}, state, {
        //             currentUser: 'apdated'
        //           })
        //     })
        // })
        // .catch(err => {
        //     console.log(err);
        // })
        console.log(action.user);
        return Object.assign({}, state, {
            currentUser: action.user.email
        })
      }
    return state;
};

export default userSignedIn;
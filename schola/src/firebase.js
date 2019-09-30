import * as firebase from 'firebase';
const config = {
    apiKey: "AIzaSyA9OFDrEAa8_Cs7d2gkhE1IsXQxPM1xCHo",
    authDomain: "schola-ff449.firebaseapp.com",
    databaseURL: "https://schola-ff449.firebaseio.com",
    projectId: "schola-ff449",
    storageBucket: "schola-ff449.appspot.com",
    messagingSenderId: "709330363212",
    appId: "1:709330363212:web:9c8a6ee0e05537621a65e9",
    measurementId: "G-TRR8H112M6"
}
firebase.initializeApp(config);
// const databaseRef = firebase.database().ref();
// export const todosRef = databaseRef.child("todos")
import React from 'react';
import ReactDOM from 'react-dom';
import './styles/reset.css';
import './styles/index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import reduxThunk from 'redux-thunk';
import reducers from './reducers/reducers';

import { reactReduxFirebase } from "react-redux-firebase";
import firebase from "./firebase";

const createStoreWithFirebase = compose(reactReduxFirebase(firebase))(
  createStore
);

const store = createStoreWithFirebase(
  reducers,
  { isLogged: false },
  applyMiddleware(reduxThunk)
);

ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();

import React from 'react';
import ReactDOM from 'react-dom';

import './styles/reset.css';
import './styles/milligram-1.3.0/dist/milligram.css';
import './styles/index.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

import {Provider} from 'react-redux';
import {createStore, applyMiddleware, compose} from 'redux';
import { persistStore, persistReducer } from 'redux-persist'
// import reduxThunk from 'redux-thunk';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/rootSaga';
import reducers from './reducers/reducers';

import { reactReduxFirebase } from "react-redux-firebase";
import firebase from "./firebase";
import storage from 'redux-persist/lib/storage'
import { PersistGate } from 'redux-persist/integration/react';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

const createStoreWithFirebase = compose(reactReduxFirebase(firebase))(
  createStore
);

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStoreWithFirebase(
  persistedReducer,
  { isLogged: false },
  composeEnhancers(applyMiddleware(sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

let persistor = persistStore(store)

ReactDOM.render(
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();

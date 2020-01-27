import { fork, take, takeLatest } from 'redux-saga/effects';
import foldersSaga from './foldersSaga';

function* rootSaga() {
    yield[
        fork(foldersSaga)
    ];
  }

export default rootSaga;
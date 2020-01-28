import { fork, take, takeLatest, call, all } from 'redux-saga/effects';
import foldersSaga from './foldersSaga';

function* rootSaga() {
    yield all([
        foldersSaga()
    ]);
  }

export default rootSaga;
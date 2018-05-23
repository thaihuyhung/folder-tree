import { call, put, fork, select, cancel, takeLatest } from 'redux-saga/effects';

import { QUERY_DOCUMENTS } from './constants';
import {
  queryDocumentsSuccess,
  queryDocumentsError
} from './action';
import request from 'utils/request';
import serialize from 'utils/serialize';

function* doQueryDocuments(action) {
  const {
    param = {}
  } = action;
  const query = serialize(param);
  const response = yield call(request, `/api/documents?${query}`);
  if (response.error) {
    yield put(queryDocumentsError(response.error));
    return;
  }
  yield put(queryDocumentsSuccess(param, response));
}

export default function* queryDocumentsWatcher() {
  yield takeLatest(QUERY_DOCUMENTS, doQueryDocuments);
}
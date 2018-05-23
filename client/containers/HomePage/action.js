import {
  QUERY_DOCUMENTS,
  QUERY_DOCUMENTS_SUCCESS,
  QUERY_DOCUMENTS_ERROR,
  COLLAPSE_FOLDER,
  COLLAPSE_ALL_FOLDER
} from './constants';

export function queryDocuments(param) {
  return {
    type: QUERY_DOCUMENTS,
    param
  };
}

export function queryDocumentsSuccess(query, data) {
  return { 
       type: QUERY_DOCUMENTS_SUCCESS, 
       query,
       data
  };
}

export function queryDocumentsError(error) {
  return { 
       type: QUERY_DOCUMENTS_ERROR, 
       error 
  };
}

export function collapseFolder(query) {
  return {
    type: COLLAPSE_FOLDER,
    query
  };
}

export function collapseAllFolder() {
  return {
    type: COLLAPSE_ALL_FOLDER
  };
}
import {
  QUERY_DOCUMENTS,
  QUERY_DOCUMENTS_SUCCESS,
  QUERY_DOCUMENTS_ERROR,
  COLLAPSE_FOLDER,
  EXPAND_FOLDER,
  COLLAPSE_ALL_FOLDER
} from './constants';
import { fromJS, Map, OrderedMap, List } from 'immutable';
import { flattenDocuments, expandAllFolder, collapseAllFolder } from '../../utils/index';

const initialState = fromJS({
  documents: {},
  documentsLoading: true,
  documentsShouldQuery: true,
  idsPath: [],
  collapsedAll: false
});

function documentsReducer(state = initialState, action) {
  switch (action.type) {
    case QUERY_DOCUMENTS:
      if (!action.param || !action.param.parentId) {
        return state
          .set('idsPath', fromJS([]))
          .set('collapsedAll', false)
          .set('documentsLoading', true);
      }
      return state;
    case QUERY_DOCUMENTS_SUCCESS:
      if (action.query && action.query.search) {
        // Search
        const results = flattenDocuments(action.data);
        return state
          .set('searchResultCount', results.length)
          .set('documentsLoading', false)
          .set('documents', fromJS(flattenDocuments(action.data)));
      } else {
        if (action.query && action.query.parentId) {
          // Expand Folder
          const { path, idsPath } = action.query;
          let documents = state.get('documents');
          documents = documents.setIn(path.concat(['expanded']), true);
          documents = documents.setIn(path.concat(['children']), fromJS(action.data))
          return state
            .set('idsPath', fromJS(idsPath))
            .set('documents', documents);
        } else if (action.query && action.query.includeChildren) {
          // Expand All
          action.data.forEach(item => expandAllFolder(item));
          return state
            .set('documentsLoading', false)
            .set('documents', fromJS(action.data));
        }
        // Default
        return state
          .set('documentsLoading', false)
          .set('documents', fromJS(action.data));
      }
    case QUERY_DOCUMENTS_ERROR:
      return state
        .set('documentsLoading', false)
        .set('documents', fromJS(null));
    case COLLAPSE_FOLDER:
      const { path, idsPath } = action.query;
      const newIdsPath = fromJS(idsPath);
      return state
        .set('collapsedAll', false)
        .set('idsPath', state.get('idsPath').equals(newIdsPath) ? fromJS([]) : newIdsPath)
        .setIn(['documents'].concat(path).concat(['expanded']), false);
    case COLLAPSE_ALL_FOLDER:
      let documents = state.get('documents');
      documents = documents.map(item => collapseAllFolder(item))
      return state
        .set('collapsedAll', true)
        .set('documents', documents);
    default:
      return state;
  }
}

export default documentsReducer;
import React, { Component } from 'react';
import { queryDocuments, collapseFolder, collapseAllFolder } from './action';
import reducer from './reducer';
import saga from './saga';
import { compose } from 'redux';
import { connect } from 'react-redux';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
} from 'material-ui/ExpansionPanel';
import Typography from 'material-ui/Typography';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Card, { CardActions, CardContent, CardHeader } from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Folder from '../../components/Folder';
import DocumentItem from '../../components/DocumentItem';
import LoadingIndicator from '../../components/LoadingIndicator';
import { CircularProgress } from 'material-ui/Progress';
import NoResult from '../../components/NoResult';

const styles = theme => ({
  card: {
    maxWidth: 'calc(768px + 16px * 2)',
    margin: '24px auto',
    display: 'flex',
    minHeight: 'calc(100vh - 64px - 80px - 48px)',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      margin: 0,
      minHeight: 'calc(100vh - 56px - 46px)',
    }
  },
  cardContent: {
    [theme.breakpoints.down('xs')]: {
      padding: 8
    }
  },
  panelDisabled: {
    backgroundColor:'#fff'
  },
  panel: {
    boxShadow: 'none',
    borderBottom: '1px solid #dedede'
  },
  panelExpanded: {
    margin: 0
  },
  panelSummary: {
    paddingLeft: 48
  },
  panelSummaryDisabled: {
    opacity: '1 !important'
  },
  panelSummaryExpanded: {
    minHeight: 48
  },
  panelSummaryContent: {
    composes: '$expanded',
    alignContent: 'flex-end',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    minHeight: 'auto',
    margin: '12px 0 !important',
  },
  expandIcon: {
    left: 0
  },
  panelDetails: {
    flexDirection: 'column'
  },
  input: {
    flex: 1
  },
  searchResult: {
    marginBottom: 16,
    color: '#434343'
  }
});

class HomePage extends Component {

  state = {
    query: ''
  }

  componentDidMount() {
    const { queryDocuments } = this.props;
    queryDocuments({
      includeChildren: 0
    });
  }

  onChangeExpansion = (data, expanded) => {
    if (expanded) {
      const { queryDocuments } = this.props;
      queryDocuments({
        parentId: data.get('id')
      })
    }
  }

  onUpdateQuery = event => {
    const { queryDocuments } = this.props;
    const query = event.target.value;
    this.setState({
      query
    });
    if (query) {
      queryDocuments({
        includeChildren: 1,
        search: query
      });
    } else {
      queryDocuments();
    }
  };

  onExpandAll = () => {
    const { queryDocuments } = this.props;
    queryDocuments({
      includeChildren: 1
    });
  }

  onCollapseAll = () => {
    const { collapseAllFolder } = this.props;
    collapseAllFolder();
  }

  renderItem = (index, key) => {
    const { classes, loading, documents, queryDocuments, collapseFolder, searchResultCount } = this.props;
    const { query } = this.state;
    return (
      <DocumentItem 
        key={documents.getIn([index, 'id'])} 
        data={documents.get(index)} 
        path={[index]}
        query={query}
        queryDocuments={queryDocuments}
        collapseFolder={collapseFolder}
      />
    );
  }

  renderContent = () => {
    const { 
      classes,
      loading,
      documents, 
      queryDocuments, 
      collapseFolder, 
      searchResultCount, 
      collapsedAll,
      idsPath
     } = this.props;
    const { query } = this.state;
    if (loading) {
      return <LoadingIndicator />;
    }
    if (documents && documents.size) {
      const searchResult = query ? <div key="search-result" className={classes.searchResult}>
        Found <b>{searchResultCount}</b> {searchResultCount > 1 ? 'documents' : 'document'}
      </div> : null;
      const items = documents.map((doc, index) => 
        <DocumentItem 
          key={doc.get('id')} 
          data={doc} 
          path={[index]}
          query={query}
          queryDocuments={queryDocuments}
          collapseFolder={collapseFolder}
          idsPath={idsPath}
          collapsedAll={collapsedAll}
        />
      );
      return [searchResult, items];
    } else if (query) {
      return <NoResult/>
    }
  }

  render() {
    const { classes, loading, documents, queryDocuments, collapseFolder } = this.props;
    const { query } = this.state;
    return (
      <Card classes={{ root: classes.card }}>
        <CardContent classes={{ root: classes.cardContent }}>
          <Grid container justify="space-between" alignItems="center">
            <Input
              classes={{ root: classes.input }}
              value={query}
              onChange={this.onUpdateQuery}
              placeholder="Search documents, folders"
              startAdornment={
                <InputAdornment position="start">
                  <Icon>search</Icon>
                </InputAdornment>
              }
            />
            <div>
              <Tooltip title="Collapse all" placement="bottom-end">
                <IconButton onClick={this.onCollapseAll}>
                  <Icon>library_books</Icon>
                </IconButton>
              </Tooltip>
              <Tooltip title="Expand all" placement="bottom-end">
                <IconButton onClick={this.onExpandAll}>
                  <Icon>library_add</Icon>
                </IconButton>
              </Tooltip>
            </div>
          </Grid>
          {this.renderContent()}
        </CardContent>
      </Card>
    );
  }
}

const mapStateToProps = state => ({
  documents: state.getIn(['home', 'documents']),
  loading: state.getIn(['home', 'documentsLoading']),
  idsPath: state.getIn(['home', 'idsPath'], []),
  collapsedAll: state.getIn(['home', 'collapsedAll']),
  searchResultCount: state.getIn(['home', 'searchResultCount'])
})

const mapDispatchToProps = {
  queryDocuments,
  collapseFolder,
  collapseAllFolder
}

const withConnect = connect(mapStateToProps, mapDispatchToProps);
const withReducer = injectReducer({ key: 'home', reducer });
const withSaga = injectSaga({ key: 'home', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyles(styles)
)(HomePage);
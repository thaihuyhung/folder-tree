import React, { Component } from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import DocumentItem from '../DocumentItem';

const styles = {
  rootItem: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  },
  expandIcon: {
    marginRight: 8,
    marginLeft: 8
  },
  folderIcon: {
    marginRight: 8
  },
  title: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: 'calc(100% - 100px)'
  },
  fileNumber: {
    color: '#757575'
  }
}


class Folder extends Component {
  shouldComponentUpdate(nextProps) {
    //Avoid unnecessary re-render
    if (nextProps.collapsedAll && nextProps.collapsedAll !== this.props.collapsedAll) {
      // In case collapse all, just re-render all root folder
      return this.props.data.get('ancestor', []).size === 0;
    }

    if (nextProps.idsPath.size !== this.props.idsPath.size) {
      // In case collapse/expand, only re-render that particular folder and its ancestors
      if (nextProps.idsPath.size) {
        return nextProps.idsPath.indexOf(nextProps.data.get('id')) > -1;
      } else if (this.props.idsPath.size) {
        return this.props.idsPath.indexOf(nextProps.data.get('id')) > -1;
      }
      return true;
    }
    return true;
  }

  renderChildren = () => {
    const { path, data, classes, onClickExpand, queryDocuments, collapseFolder, idsPath, collapsedAll } = this.props;
    if (data.get('children') && data.get('expanded')) {
      return data
        .get('children')
        .map((doc, index) => 
          <DocumentItem 
            key={doc.get('id')} 
            data={doc} 
            queryDocuments={queryDocuments} 
            collapseFolder={collapseFolder}
            path={path.concat(['children', index])} 
            idsPath={idsPath}
            collapsedAll={collapsedAll}
          />)
    }
    return null;
  }

  handleClick = (id) => {
    const { path, data, classes, onClickExpand, queryDocuments, collapseFolder } = this.props;
    const isExpanded = data.get('expanded');
    const idsPath = [data.get('id')].concat(data.get('ancestor', []).toArray());
    if (isExpanded && collapseFolder) {
      collapseFolder({
        path,
        idsPath
      });
    } else if (queryDocuments) {
      queryDocuments({
        parentId: id,
        path,
        idsPath
      });
    }
  };

  render() {
    const { path, data, classes, onClickExpand, queryDocuments, collapseFolder } = this.props;
    const isExpanded = data.get('expanded');
    return (
      [<ListItem 
        key={data.get('id')}
        button 
        onClick={() => this.handleClick(data.get('id'))} 
        disableGutters 
        classes={{ root: classes.rootItem }}
        style={{ paddingLeft: data.get('ancestor').size * 30 }}
      >
        <ListItemIcon classes={{ root: classes.expandIcon }}>
          <Icon>{isExpanded ? 'remove' : 'add'}</Icon>
        </ListItemIcon>
        <ListItemIcon classes={{ root: classes.folderIcon }}>
          <Icon>folder</Icon>
        </ListItemIcon>
        <div className={classes.title}>
          <span className={classes.fileNumber}>{data.get('number')} </span>
          <span>{data.get('name')}</span>
        </div>
      </ListItem>,
      this.renderChildren()
      ]
    );
  }
}

export default withStyles(styles)(Folder);
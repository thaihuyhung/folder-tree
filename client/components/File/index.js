import React, { Component } from 'react';
import List, { ListItem, ListItemIcon, ListItemText } from 'material-ui/List';
import Collapse from 'material-ui/transitions/Collapse';
import Icon from 'material-ui/Icon';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Highlight from 'react-highlighter';
import Dialog, { DialogTitle, DialogContent, DialogContentText } from 'material-ui/Dialog';
import { formatBytes } from '../../utils/index';

const styles = {
  listItem: {
    '&:not(:last-child)': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
    }
  },
  fileIcon: {
    marginRight: 8
  },
  grid: {
    width: 'calc(100% - 32px)',
    paddingRight: 16
  },
  title: {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    width: 'calc(100% - 100px)'
  },
  fileSize: {
    fontSize: 12,
    color: '#757575'
  },
  fileNumber: {
    color: '#757575',
    marginRight: 4
  }
}

class File extends Component {
  state = {
    openDialog: false
  }

  shouldComponentUpdate(nextProps, nextState) {
    // Avoid unnecessary re-render
    return nextProps.data.get('id') !== this.props.data.get('id') 
      || nextState.openDialog !== this.state.openDialog;
  }

  handleCloseDialog = () => {
    this.setState({
      openDialog: false
    })
  };

  handleOpenDialog = () => {
    this.setState({
      openDialog: true,
    });
  };

  render() {
    const { query, data, classes } = this.props;
    const { openDialog } = this.state;
    return [
      <ListItem
        key={data.get('id')}
        button
        disableGutters
        classes={{ root: classes.listItem }}
        style={{ paddingLeft: query ? 0 : data.get('ancestor').size * 30 + 39 }}
        onClick={this.handleOpenDialog}
      >
        <ListItemIcon classes={{ root: classes.fileIcon }}>
          <Icon>insert_drive_file</Icon>
        </ListItemIcon>
        <Grid container alignItems="center" justify="space-between" classes={{ container: classes.grid }}>
          <div className={classes.title}>
            <Highlight 
              className={classes.fileNumber} search={query || ''} 
              matchElement="mark"
            >{data.get('number')}</Highlight>
            <Highlight 
              search={query || ''} 
              matchElement="mark"
            >{data.get('name')}</Highlight>
          </div>
          <div className={classes.fileSize}>{formatBytes(data.get('fileSize'))}</div>
        </Grid>
      </ListItem>,
      <Dialog key={data.get('id') + 'dialog'} open={openDialog} onClose={this.handleCloseDialog} >
        <DialogTitle>File info</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <strong>File name: </strong><span>{data.get('name')}</span>
          </DialogContentText>
          <DialogContentText>
            <strong>File size: </strong><span>{formatBytes(data.get('fileSize'))}</span>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    ];
  }
}

export default withStyles(styles)(File);
import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Hidden from 'material-ui/Hidden';
import { withStyles } from 'material-ui/styles';

const styles = {
  title: {
    flex: 1
  }
}

const Header = ({ classes }) => {
  return (
    <AppBar position="sticky">
        <Toolbar>
          <Hidden xsDown>
            <IconButton color="inherit">
              <Icon>menu</Icon>
            </IconButton>
          </Hidden>
          <Typography classes={{ root: classes.title }} variant="title" color="inherit">
            Front End Coding Challenge
          </Typography>
          <Hidden xsDown>
            <IconButton color="inherit">
              <Icon>account_circle</Icon>
            </IconButton>
          </Hidden>
        </Toolbar>
      </AppBar>
  );
}

export default withStyles(styles)(Header);
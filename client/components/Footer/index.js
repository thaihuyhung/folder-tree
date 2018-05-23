import React, { Component } from 'react';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  container: {
    height: 80,
    padding: 24,
    background: '#dbdbdb',
    [theme.breakpoints.down('xs')]: {
      padding: 8,
      height: 46
    }
  },
  text: {
    textAlign: 'left'
  }
})

const Footer = ({ classes }) => {
  return (
    <Grid
      container 
      justify="space-between" 
      alignItems="flex-start" 
      classes={{ container: classes.container }}
    >
      <Typography variant="caption" gutterBottom align="center">
        <div className={classes.text}>Email: hungth.it@gmail.com</div>
        <div className={classes.text}>Skype: hunghthai@outlook.com</div>
      </Typography>
      <Typography variant="caption" gutterBottom align="center">
        Thai Huy Hung © 2018
      </Typography>
    </Grid>
  );
}

export default withStyles(styles)(Footer);
import React from 'react';
import { CircularProgress } from 'material-ui/Progress';
import Grid from 'material-ui/Grid';
import { withStyles } from 'material-ui/styles';

const styles = {
  container: {
    padding: 24
  }
}

const LoadingIndicator = ({ classes }) => (
  <Grid container justify="center" alignItems="center" classes={{ container: classes.container }}>
    <CircularProgress/>
  </Grid>
);

export default withStyles(styles)(LoadingIndicator);
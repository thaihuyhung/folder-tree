import React from 'react';
import Grid from 'material-ui/Grid';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = {
  container: {
    minHeight: 200
  },
  icon: {
    fontSize: 56,
    color: '#757575'
  }
}

const NoResult = ({ classes }) => {
  return (
    <Grid classes={{ container: classes.container }} container justify="center" alignItems="center" direction="column">
      <Icon classes={{ root: classes.icon }}>search</Icon>
      <Typography variant="subheading" gutterBottom>
        No Result Found
      </Typography>
    </Grid>
  );
};

export default withStyles(styles)(NoResult);
/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage/Loadable';
import Header from 'components/Header';
import Footer from 'components/Footer';
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
import blue from 'material-ui/colors/blue';
import pink from 'material-ui/colors/pink';
import red from 'material-ui/colors/red';

const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: pink,
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

export default function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <Header />
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
      <Footer />
    </MuiThemeProvider>
  );
}
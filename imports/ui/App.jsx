import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Routes from './../startup/client/routes';

// App component - represents the whole app
export default class App extends Component {
  componentDidMount() {
    // Adding language to html tag b/c Meteor won't let us touch it
    document.getElementsByTagName('html')[0].setAttribute('lang', 'en');
  }

  render() {
    return (
      <MuiThemeProvider>
        <Routes />
      </MuiThemeProvider>
    );
  }
}

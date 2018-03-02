import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import Routes from './../startup/client/routes';

const muiTheme = getMuiTheme({
  palette: {
    textColor: '#000000',
    primary1Color: '#652F6C',
    primary2Color: '#652F6C',
    primary3Color: '#652F6C',
    accent1Color: '#380A3E',
    accent2Color: '#380A3E',
    accent3Color: '#380A3E',
    pickerHeaderColor: '#652F6C',
    clockCircleColor: '#652F6C',
  },
});

// App component - represents the whole app
export default class App extends Component {
  componentDidMount() {
    // Adding language to html tag b/c Meteor won't let us touch it
    document.getElementsByTagName('html')[0].setAttribute('lang', 'en');
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <Routes />
      </MuiThemeProvider>
    );
  }
}

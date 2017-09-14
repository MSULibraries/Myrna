import React, { Component } from "react";
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Routes from "./../startup/client/routes";

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider>
        <Routes />
      </MuiThemeProvider>
    );
  }
}

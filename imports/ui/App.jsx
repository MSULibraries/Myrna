import React, { Component } from "react";

import Routes from "./../startup/client/routes";

// App component - represents the whole app
export default class App extends Component {
  render() {
    return (
      <div>
        <Routes />
      </div>
    );
  }
}

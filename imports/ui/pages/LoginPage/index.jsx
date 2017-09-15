import React from "react";
import { Container } from "react-grid-system";
import { Redirect } from "react-router-dom";

import AccountsUIWrapper from "./../../components/AccountsUIWrapper/index";

class LoginPage extends React.Component {
  state = {
    redirectToReferrer: false
  };

  redirectBack = () => {
    this.setState({ redirectToReferrer: true });
  };

  render() {
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <Container>
        <h1>Login Page</h1>
        <p>You must log in to view that page</p>
        <AccountsUIWrapper />
        <br />
        <button onClick={this.redirectBack}>Go Back to {from.pathname}</button>
      </Container>
    );
  }
}

export default LoginPage;

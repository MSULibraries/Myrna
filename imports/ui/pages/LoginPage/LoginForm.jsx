import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';

class LoginForm extends Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      error: {},
    };
  }

  clearError = () => this.setState({ error: '' });
  clearForm = () => this.setState({ email: '', password: '' });

  handleEmailChange = ({ target: { value: newEmail } }) => {
    this.clearError();
    this.setState({ email: newEmail });
  };

  handlePasswordChange = ({ target: { value: newPassword } }) => {
    this.clearError();
    this.setState({ password: newPassword });
  };

  handleSubmit = e => {
    e.preventDefault();

    this.clearError();
    Meteor.loginWithPassword(this.state.email, this.state.password, error => {
      if (error) {
        this.setState({ error });
      } else {
        this.clearForm();
      }
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          autoComplete="username password"
          hintText="Email"
          onChange={this.handleEmailChange}
          floatingLabelText="Email"
          type="email"
          value={this.state.email}
        />
        <br />
        <TextField
          autoComplete="current-password"
          hintText="Password"
          onChange={this.handlePasswordChange}
          floatingLabelText="Password"
          type="password"
          value={this.state.password}
        />
        <br />
        {this.state.error.reason && this.state.error.reason}
        <br />
        <RaisedButton type="submit" label="login" />
      </form>
    );
  }
}

export default LoginForm;

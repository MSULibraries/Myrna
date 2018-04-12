import { Accounts } from 'meteor/accounts-base';
import { withTracker } from 'meteor/react-meteor-data';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';

import createUser from './../../../../api/user/createUser/index';

class NewUserForm extends Component {
  constructor() {
    super();

    this.state = {
      createUserSuccess: false,
      email: '',
      name: '',
      passwordConfirm: '',
      password: '',
      error: {},
    };
  }
  clearSuccess = () => this.setState({ createUserSuccess: false });
  clearError = () => this.setState({ error: '' });
  clearForm = () => this.setState({ email: '', name: '', password: '', passwordConfirm: '' });

  handleEmailChange = ({ target: { value: newEmail } }) => {
    this.onDirty();
    this.setState({ email: newEmail });
  };

  handleNameChange = ({ target: { value: newName } }) => {
    this.onDirty();
    this.setState({ name: newName });
  };

  handlePasswordChange = ({ target: { value: newPassword } }) => {
    this.onDirty();
    this.setState({ password: newPassword });
  };

  handleConfirmPasswordChange = ({ target: { value: newPassword } }) => {
    this.onDirty();
    this.setState({ passwordConfirm: newPassword });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.onDirty();
    const { email, name, password } = this.state;
    if (this.state.password === this.state.passwordConfirm) {
      this.props.createUser.call({ email, name, password }, (error, resp) => {
        if (!error) {
          this.clearForm();
          this.setState({ createUserSuccess: true });
        }
      });
    } else {
      this.setState({ error: { reason: 'Passwords do not match' } });
    }
  };

  onDirty = () => {
    this.clearError();
    this.clearSuccess();
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          hintText="Name"
          onChange={this.handleNameChange}
          floatingLabelText="Name"
          type="text"
          value={this.state.name}
        />
        <br />
        <TextField
          hintText="Email"
          onChange={this.handleEmailChange}
          floatingLabelText="Email"
          type="email"
          value={this.state.email}
        />
        <br />
        <TextField
          hintText="Password"
          onChange={this.handlePasswordChange}
          floatingLabelText="Password"
          type="password"
          value={this.state.password}
        />
        <br />
        <TextField
          hintText="Confirm Password"
          onChange={this.handleConfirmPasswordChange}
          floatingLabelText="Confirm Password"
          type="password"
          value={this.state.passwordConfirm}
        />
        <br />
        {this.state.error.reason && this.state.error.reason}
        {this.state.createUserSuccess && 'New user account has been made.'}
        <br />
        <RaisedButton type="submit" label="Submit" />
      </form>
    );
  }
}

export default withTracker(() => ({
  createUser,
}))(NewUserForm);

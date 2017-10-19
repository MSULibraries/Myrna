import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class NewAddressForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      company: '',
      city: '',
      name: '',
      streetAddress: '',
      state: '',
      zip: '',
    };

    this.processFormData = this.processFormData.bind(this);
    this.updateFormState = this.updateFormState.bind(this);
  }

  updateFormState(key, value) {
    this.setState({ [key]: value });
  }

  processFormData() {
    this.props.submitForm(this.state);
  }

  render() {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          this.processFormData();
        }}
      >
        <TextField
          hintText="Company"
          onChange={e => this.updateFormState('company', e.target.value)}
        />
        <br />
        <TextField hintText="Name" onChange={e => this.updateFormState('name', e.target.value)} />
        <br />
        <TextField
          hintText="Street Address"
          onChange={e => this.updateFormState('streetAddress', e.target.value)}
        />
        <br />
        <TextField hintText="City" onChange={e => this.updateFormState('city', e.target.value)} />
        <br />
        <TextField hintText="State" onChange={e => this.updateFormState('state', e.target.value)} />
        <br />
        <TextField hintText="Zip" onChange={e => this.updateFormState('zip', e.target.value)} />
        <br />
        <FlatButton primary type="submit" label="Submit" />
        <FlatButton secondary onClick={() => this.props.cancelForm()} label="Cancel" />
      </form>
    );
  }
}

NewAddressForm.prototypes = {
  submitForm: PropTypes.func.isRequired,
};

export default NewAddressForm;

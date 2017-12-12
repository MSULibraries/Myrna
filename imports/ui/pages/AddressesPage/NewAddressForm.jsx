import DropDownMenu from 'material-ui/DropDownMenu';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class NewAddressForm extends Component {
  constructor(props) {
    super(props);

    const allowedStates = ['Mississippi', 'Alabama', 'Tennessee', 'Louisiana'];

    this.state = {
      allowedStates,
      company: '',
      city: '',
      name: '',
      streetAddress: '',
      state: allowedStates[0],
      zip: '',
    };
  }

  updateFormState = (key, value) => {
    this.setState({ [key]: value });
  };

  processFormData = () => {
    this.props.submitForm(this.state);
  };

  render() {
    return (
      <form
        onSubmit={e => {
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
        <DropDownMenu
          value={this.state.state}
          onChange={(e, i, value) => this.updateFormState('state', value)}
          iconStyle={{ right: 0, margin: 0, padding: 0, width: 'auto' }}
          labelStyle={{ paddingLeft: 0 }}
          underlineStyle={{ margin: 0 }}
        >
          {this.state.allowedStates.map(state => (
            <MenuItem key={state} value={state} primaryText={state} />
          ))}
        </DropDownMenu>
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

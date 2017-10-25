import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

class NewShowPrompt extends Component {
  constructor() {
    super();

    this.state = { newShowName: '' };

    this.updateNewShowName = this.updateNewShowName.bind(this);
  }

  updateNewShowName(newText) {
    this.setState({ newShowName: newText });
  }

  render() {
    return (
      <div>
        <TextField
          hintText="Name of New Show"
          onChange={({ target: { value: newText } }) => this.updateNewShowName(newText)}
        />
        <FlatButton
          disabled={this.state.newShowName.length === 0}
          label="Submit"
          onClick={() => this.props.setNewShowName(this.state.newShowName)}
        />
      </div>
    );
  }
}

NewShowPrompt.proptypes = {
  setNewShowName: PropTypes.func.isRequired,
};

export default NewShowPrompt;

import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import PropTypes from 'prop-types';
import React from 'react';

export default class InputSpecialInstructions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      specialInstr: '',
    };
    this.updateSpecialInstr = this.updateSpecialInstr.bind(this);
  }

  updateSpecialInstr(specialInstr) {
    this.setState({ specialInstr });
  }

  render() {
    return (
      <div>
        <TextField
          fullWidth
          floatingLabelText="Optional: Special Instructions For Order"
          multiLine
          onChange={({ target: { value } }) => this.updateSpecialInstr(value)}
          rows={3}
          rowsMax={8}
        />
        <FlatButton
          label={this.state.specialInstr === '' ? 'No Instructions' : 'Submit'}
          onClick={() => this.props.setSpecialIntr(this.state.specialInstr)}
        />
      </div>
    );
  }
}

InputSpecialInstructions.propTypes = {
  setSpecialIntr: PropTypes.func.isRequired,
};

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

class CrudForm extends Component {
  static propTypes = {
    description: PropTypes.string,
    handleSubmit: PropTypes.func,
    measurements: PropTypes.string,
    quality: PropTypes.oneOf(['good', 'excellent', 'bad', 'terrible']),
  };

  static defaultProps = {
    description: '',
    measurements: '',
    quality: 'excellent',
  };

  constructor() {
    super();

    this.state = {};
  }

  componentDidMount() {
    this.setState({
      measurements: this.props.measurements,
      description: this.props.description,
      quality: this.props.quality,
    });
  }

  handleMeasurementChange = newMeasurement => {
    this.setState({ measurements: newMeasurement });
  };
  handleDescriptionChange = newDescription => {
    this.setState({ description: newDescription });
  };
  handleQualityChange = newQuality => {
    this.setState({ quality: newQuality });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.handleSubmit({
      description: this.state.description,
      measurements: this.state.measurements,
      quality: this.state.quality,
    });
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <TextField
          multiLine={true}
          floatingLabelText="Short Description"
          rows={10}
          type="text"
          defaultValue={this.props.description}
          onChange={e => this.handleDescriptionChange(e.target.value)}
        />
        <br />
        <TextField
          multiLine={true}
          rows={10}
          floatingLabelText="Measurements"
          defaultValue={this.props.measurements}
          onChange={e => this.handleMeasurementChange(e.target.value)}
        />
        <br />
        <label htmlFor="quality">
          Quality
          <select
            name=""
            id=""
            defaultValue={this.props.quality}
            onChange={e => this.handleQualityChange(e.target.value)}
          >
            <option value="excellent">Excellent</option>
            <option value="good">Good</option>
            <option value="bad">Bad</option>
            <option value="terrible">Terrible</option>
          </select>
        </label>

        <input type="submit" />
      </form>
    );
  }
}

export default CrudForm;

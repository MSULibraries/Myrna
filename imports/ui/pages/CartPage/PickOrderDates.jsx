/**
 * Prompts a user to pick a date to arrive by and
 * a date to return the shipment on
 *
 * Date inputs shouldn't allow dates before the current date
 * the arrive by date can't be after the ship back date
 *
 * Submit can't happen unless both dates are entered
 */

import DatePicker from 'material-ui/DatePicker';
import FlatButton from 'material-ui/FlatButton';
import PropTypes from 'prop-types';
import React, { Component } from 'react';

export class PickOrderDates extends Component {
  constructor() {
    super();
    this.state = {
      dateToArriveBy: undefined,
      dateToShipBack: undefined,
      minDate: new Date(), // Min date starts at today's date
    };

    this.handleArriveByChange = this.handleArriveByChange.bind(this);
    this.handleShipBackChange = this.handleShipBackChange.bind(this);
  }

  handleArriveByChange(date) {
    this.setState({ dateToArriveBy: date, minDate: date });
  }
  handleShipBackChange(date) {
    this.setState({ dateToShipBack: date });
  }

  render() {
    return (
      <div>
        <DatePicker
          autoOk
          hintText="Date to Arrive By"
          minDate={this.state.minDate}
          maxDate={this.state.dateToShipBack}
          onChange={(event, date) => this.handleArriveByChange(date)}
        />
        <DatePicker
          autoOk
          hintText="Date to Ship Back"
          minDate={this.state.minDate}
          onChange={(event, date) => this.handleShipBackChange(date)}
        />
        <FlatButton
          disabled={
            this.state.dateToArriveBy === undefined || this.state.dateToShipBack === undefined
          }
          onClick={() =>
            this.props.setOrderDates(this.state.dateToArriveBy, this.state.dateToShipBack)}
          label="Submit"
        />
      </div>
    );
  }
}

PickOrderDates.proptypes = {
  setOrderDates: PropTypes.func.isRequired,
};

export default PickOrderDates;

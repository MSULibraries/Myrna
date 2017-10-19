/**
 * Allows a user to pick an address to attach to an order when
 * they submit an order
 */

import { List, ListItem } from 'material-ui/List';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Addresses from './../../../api/addresses';

class PickAddress extends Component {
  constructor() {
    super();

    this.renderAddresses = this.renderAddresses.bind(this);
    this.renderNoAddress = this.renderNoAddress.bind(this);
  }

  /**
   * Renders all addresses
   */
  renderAddresses() {
    return (
      <List>
        {this.props.addresses.map(address => (
          <ListItem key={address.street1} onClick={() => this.props.selectAddress(address._id)}>
            <p>{address.company}</p>
            <p>{address.name}</p>
            <p>
              {address.street1}
              {address.city}, {address.state} {address.zip}
            </p>
          </ListItem>
        ))}
      </List>
    );
  }

  /**
   * Returns JSX that displays no addresses availible and
   * gives link to addresses page to create one
   */
  renderNoAddress() {
    return (
      <div>
        <p>No Addresses Availible</p>
        <Link to="addresses/new">Create an address</Link>
      </div>
    );
  }

  render() {
    // If there are addresses list them, otherwise, display no address message
    return this.props.addresses.length > 0 ? this.renderAddresses() : this.renderNoAddress();
  }
}
PickAddress.defaultProps = {
  addresses: [],
};

PickAddress.proptypes = {
  addresses: PropTypes.array,
  selectAddress: PropTypes.func.isRequired,
};

export default (PickAddress = createContainer(() => {
  Meteor.subscribe('addresses');
  return {
    addresses: Addresses.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, PickAddress));

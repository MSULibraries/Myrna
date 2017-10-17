import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import FlatButton from 'material-ui/FlatButton';
import { createContainer } from 'meteor/react-meteor-data';

import NewAddressForm from './NewAddressForm';
import Addresses from './../../../api/addresses';
import BreadCrumbs from './../../components/BreadCrumbs/index';

export class AddressesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingNewAddress: false,
    };

    this.addNewAddress = this.addNewAddress.bind(this);
    this.toggleAddingNewAddress = this.toggleAddingNewAddress.bind(this);
  }

  addNewAddress(newAddress) {
    console.log('addNewAddress: ', newAddress);
  }

  toggleAddingNewAddress() {
    this.setState({ addingNewAddress: !this.state.addingNewAddress });
  }

  render() {
    return (
      <Container>
        <h1>Addresses</h1>
        <BreadCrumbs crumbs={['Profile', 'Addresses']} />

        {!this.state.addingNewAddress && (
          <div>
            <ul>
              {this.props.addresses.length > 0
                ? this.props.addresses.map(address => <li>{address}</li>)
                : 'No Addresses'}
            </ul>
            <FlatButton onClick={() => this.toggleAddingNewAddress()} label="New Address" />
          </div>
        )}

        {this.state.addingNewAddress && (
          <div>
            <NewAddressForm
              submitForm={newAddress => this.addNewAddress(newAddress)}
              cancelForm={() => this.toggleAddingNewAddress()}
            />
          </div>
        )}
      </Container>
    );
  }
}

AddressesPage.defaultProps = {
  addresses: [],
};

AddressesPage.proptypes = {
  addresses: PropTypes.array,
};

export default (AddressesPage = createContainer(() => {
  Meteor.subscribe('addresses');
  return {
    addresses: Addresses.find({}, { sort: { createdAt: -1 } }).fetch(),
  };
}, AddressesPage));

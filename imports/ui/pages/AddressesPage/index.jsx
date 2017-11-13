import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import FlatButton from 'material-ui/FlatButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import { createContainer } from 'meteor/react-meteor-data';

import NewAddressForm from './NewAddressForm';
import Addresses from './../../../api/addresses';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import LeftNav from '../../components/LeftNav/LeftNav';

// Adjusted contrast to help with a11y
const darkerTableHeaders = {
  color: '#575757',
};

const alignCenter = {
  textAlign: 'center',
};

const centerColumn = {
  display: 'flex',
  alignItems: 'center',
};

export class AddressesPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addingNewAddress: false,
    };

    this.addNewAddress = this.addNewAddress.bind(this);
    this.toggleAddingNewAddress = this.toggleAddingNewAddress.bind(this);
  }

  componentWillMount() {
    const option = this.props.match.params.option;
    if (option === 'new') {
      this.setState({ addingNewAddress: true });
    }
  }

  /**
   * Takes in new address information and calls insert endpoint
   * @param {String} city
   * @param {String} company
   * @param {String} name
   * @param {String} state
   * @param {String} streetAddress
   * @param {String} zip
   */
  addNewAddress({
    city, company, name, state, streetAddress, zip,
  }) {
    Meteor.call('addresses.insert', city, company, name, state, streetAddress, zip);
    this.setState({ addingNewAddress: false });
  }

  /**
   * Removes address from collection by id
   * @param {string} addressId
   */
  removeAddress(addressId) {
    Meteor.call('addresses.remove', addressId);
  }

  /**
   * Hides or Shows new address form
   */
  toggleAddingNewAddress() {
    this.setState({ addingNewAddress: !this.state.addingNewAddress });
  }

  render() {
    return (
      
      <Container>
        <Helmet
          title="Addresses"
          meta={[
            {
              name: 'description',
              content: 'Lists all addresses associated with a user',
            },
          ]}
        />
        <h1>Addresses</h1>

        <Row>
          <LeftNav />
          <Col sm={8}>
            <BreadCrumbs crumbs={['/Profile', 'Addresses']} />
            {!this.state.addingNewAddress && (
              <div>
                <Table>
                  <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                      <TableHeaderColumn style={darkerTableHeaders}>Company</TableHeaderColumn>
                      <TableHeaderColumn style={darkerTableHeaders}>Name </TableHeaderColumn>
                      <TableHeaderColumn style={darkerTableHeaders}>Street </TableHeaderColumn>
                      <TableHeaderColumn style={darkerTableHeaders}>City</TableHeaderColumn>
                      <TableHeaderColumn style={darkerTableHeaders}>State </TableHeaderColumn>
                      <TableHeaderColumn style={darkerTableHeaders}>Zip </TableHeaderColumn>

                      <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                        Remove
                      </TableHeaderColumn>
                    </TableRow>
                  </TableHeader>
                  <TableBody displayRowCheckbox={false}>
                    {this.props.addresses.map(address => (
                      <TableRow key={address.company}>
                        <TableRowColumn>{address.company}</TableRowColumn>
                        <TableRowColumn>{address.name}</TableRowColumn>
                        <TableRowColumn>{address.street1}</TableRowColumn>
                        <TableRowColumn>{address.city}</TableRowColumn>
                        <TableRowColumn>{address.state}</TableRowColumn>
                        <TableRowColumn>{address.zip}</TableRowColumn>
                        <TableRowColumn style={centerColumn}>
                          <FlatButton
                            onClick={() => this.removeAddress(address._id)}
                            secondary
                            label="X"
                          />
                        </TableRowColumn>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

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
        </Col>
      </Row>
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

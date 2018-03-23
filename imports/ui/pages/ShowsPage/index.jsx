import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Container, Row } from 'react-grid-system';
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
import { withTracker } from 'meteor/react-meteor-data';

import Show from './../../../api/show/index';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import LeftNav from '../../components/LeftNav/index';

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

export class ShowsPage extends Component {
  /**
   * Takes in new address information and calls insert endpoint
   * @param {String} city
   * @param {String} company
   * @param {String} name
   * @param {String} state
   * @param {String} streetAddress
   * @param {String} zip
   */
  addNewAddress = ({ city, company, name, state, streetAddress, zip }) => {
    Meteor.call('addresses.insert', city, company, name, state, streetAddress, zip);
    this.setState({ addingNewAddress: false });
  };

  /**
   * Removes address from collection by id
   * @param {string} addressId
   */
  removeShow = (showId) => {
    Meteor.call('show.remove', showId);
  }

  /**
   * Hides or Shows new address form
   */
  toggleAddingNewAddress = () => {
    this.setState({ addingNewAddress: !this.state.addingNewAddress });
  };

  render() {
    return (
      <Container>
        <Helmet
          title="Addresses"
          meta={[
            {
              name: 'description',
              content: 'Lists all shows created by a user',
            },
          ]}
        />
        <h1>Shows</h1>

        <Row>
          <Col sm={3}>
            <LeftNav />
          </Col>
          <Col sm={8}>
            <BreadCrumbs crumbs={['/Profile', 'Shows']} />
            <div>
              <Table>
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn style={darkerTableHeaders}>Name</TableHeaderColumn>

                    <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                      Remove
                    </TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                  {this.props.shows.map(show => (
                    <TableRow key={show.name}>
                      <TableRowColumn>{show.name}</TableRowColumn>
                      <TableRowColumn style={centerColumn}>
                        <FlatButton
                          onClick={() => this.removeShow(show._id)}
                          secondary
                          label="X"
                        />
                      </TableRowColumn>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

ShowsPage.defaultProps = {
  shows: [],
};

ShowsPage.proptypes = {
  addresses: PropTypes.array,
};

export default withTracker(props => {
  Meteor.subscribe('show');

  return {
    shows: Show.find({}).fetch(),
  };
})(ShowsPage);

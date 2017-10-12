import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Container } from 'react-grid-system';
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

import Order from './../../../api/orders';

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

class OrdersPage extends Component {
  constructor() {
    super();

    this.deleteOrder = this.deleteOrder.bind(this);
  }

  deleteOrder(id) {
    Meteor.call('order.delete', id);
  }

  render() {
    return (
      <Container>
        <h1>Orders</h1>

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={darkerTableHeaders}>Order ID</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Ordered On</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Product Ids</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Status</TableHeaderColumn>

              <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                Cancel
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.orders.map(order => (
              <TableRow key={order._id}>
                <TableRowColumn>{order._id}</TableRowColumn>
                <TableRowColumn>
                  {new Date(order.dateAdded).toLocaleDateString('en-US')}
                </TableRowColumn>
                <TableRowColumn>{JSON.stringify(order.productIds)}</TableRowColumn>
                <TableRowColumn>{order.status}</TableRowColumn>
                <TableRowColumn style={centerColumn}>
                  <FlatButton onClick={() => this.deleteOrder(order._id)} secondary label="X" />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <FlatButton onClick={() => Meteor.call('order.insert')} label="Submit Order" />
      </Container>
    );
  }
}

OrdersPage.defaultProps = {
  orders: [],
};

OrdersPage.proptypes = {
  orders: PropTypes.array,
};

export default (OrdersPage = createContainer(() => {
  Meteor.subscribe('orders');
  return {
    orders: Order.find({}).fetch(),
  };
}, OrdersPage));

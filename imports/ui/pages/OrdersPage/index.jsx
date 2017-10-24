import Dialog from 'material-ui/Dialog';
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
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';

import AddressList from './../../components/AddressList/index';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import { isMaintainer } from './../../../../lib/roles';
import Addresses from './../../../api/addresses';
import Order from './../../../api/orders/orders';
import OrderAddress from './../../../api/orders/orderAddress';
import OrderTrackingId from './../../../api/orders/orderTrackingId';

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

    this.state = {
      modalOpen: false,
      orderAddresses: {},
      selectedOrderAddress: undefined,
    };

    this.approveOrder = this.approveOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.getOrderAddress = this.getOrderAddress.bind(this);
    this.getOrderAddresses = this.getOrderAddresses.bind(this);
    this.renderOrderTrackingLink = this.renderOrderTrackingLink.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orders !== nextProps.orders) {
      this.getOrderAddresses(nextProps.orders);
    }
  }

  approveOrder(id) {
    Meteor.call('order.approve', id);
  }

  deleteOrder(id) {
    Meteor.call('order.delete', id);
  }

  getOrderAddresses(orders) {
    orders.map(({ _id }) => {
      const orderAddress = this.getOrderAddress(_id);
      this.setState({ orderAddresses: { [_id]: orderAddress } });
    });
  }

  getOrderAddress(orderId) {
    const { addressId } = OrderAddress.findOne({ orderId });

    const orderAddress = Addresses.findOne({ _id: addressId });

    this.setState({ selectedOrderAddress: orderAddress });
  }

  renderOrderTrackingLink({ _id: orderId, status }) {
    if (status === 'Active') {
      const orderTrackingIdObject = OrderTrackingId.findOne({ orderId });
      if (orderTrackingIdObject !== undefined) {
        return (
          <a href={orderTrackingIdObject.trackingUrl} target="_blank">
            {' '}
            {orderTrackingIdObject.trackingId}
          </a>
        );
      }
    }
    return '';
  }

  /**
   * Opens modal to select addresses to ship to
   */
  handleOpen = id => {
    this.setState({ modalOpen: true });
  };

  /**
   * Closes modal to select addresses to ship to
   */
  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    return (
      <Container>
        <h1>Orders</h1>
        <BreadCrumbs crumbs={['Profile', 'Orders']} />

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={darkerTableHeaders}>Order Owner</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Tracking ID</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Ordered On</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Product Ids</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Status</TableHeaderColumn>
              <TableHeaderColumn style={{ darkerTableHeaders }}>Address</TableHeaderColumn>
              <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                Cancel
              </TableHeaderColumn>

              {isMaintainer() && (
                <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                  Approve
                </TableHeaderColumn>
              )}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.orders.map(order => (
              <TableRow key={order._id}>
                <TableRowColumn>{order.userId}</TableRowColumn>

                <TableRowColumn>{this.renderOrderTrackingLink(order)}</TableRowColumn>

                <TableRowColumn>
                  {new Date(order.dateAdded).toLocaleDateString('en-US')}
                </TableRowColumn>

                <TableRowColumn>{JSON.stringify(order.productIds)}</TableRowColumn>

                <TableRowColumn>{order.status}</TableRowColumn>

                <TableRowColumn>
                  <FlatButton onClick={() => this.handleOpen(order._id)} label="View" />
                </TableRowColumn>

                <TableRowColumn>
                  <FlatButton onClick={() => this.deleteOrder(order._id)} secondary label="X" />
                </TableRowColumn>

                {isMaintainer() && (
                  <TableRowColumn>
                    <FlatButton onClick={() => this.approveOrder(order._id)} secondary label="✓" />
                  </TableRowColumn>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog
          title="Order Address"
          modal={false}
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
        >
          <AddressList addresses={[this.state.selectedOrderAddress]} />
          <FlatButton onClick={() => this.handleClose()} label="Close" />
        </Dialog>
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
  Meteor.subscribe('addresses');
  Meteor.subscribe('order.trackingId');
  Meteor.subscribe('order.address');
  Meteor.subscribe('orders');

  return {
    orders: Order.find({}).fetch(),
    orderAddresses: OrderAddress.find({}).fetch(),
    orderTrackingId: OrderTrackingId.find({}).fetch(),
  };
}, OrdersPage));

import { find } from 'lodash';
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
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';

import AddressList from './../../components/AddressList/index';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import { isMaintainer } from './../../../../lib/roles';
import Addresses from './../../../api/addresses';
import Order from './../../../api/order/order';
import OrderAddress from './../../../api/order/bridges/orderAddress';
import OrderTrackingId from './../../../api/order/bridges/orderTrackingId';
import { Loader } from './../../components/Loader/index';
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

export class OrdersPage extends Component {
  constructor() {
    super();

    this.state = {
      isBuyingOrder: false,
      modalBuyingOpen: false,
      modalOpen: false,
      paymentUrl: null,
      orderAddresses: {},
      selectedOrderAddress: undefined,
    };

    this.approveOrder = this.approveOrder.bind(this);
    this.buyOrder = this.buyOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.getOrderAddress = this.getOrderAddress.bind(this);
    this.getOrderAddresses = this.getOrderAddresses.bind(this);
    this.renderOrderTrackingLink = this.renderOrderTrackingLink.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orders !== nextProps.orders && nextProps.orders.length > 0) {
      this.getOrderAddresses(this.props.orders);
    }
  }

  approveOrder(id) {
    Meteor.call('order.approve', id);
  }

  buyOrder(orderId) {
    this.setState({ modalBuyingOpen: true, isBuyingOrder: true });
    Meteor.call('order.buy', orderId, (error, paymentUrl) => {
      if (error) {
        console.error(error);
      } else {
        this.setState({ isBuyingOrder: false, paymentUrl });
      }
    });
  }

  deleteOrder(id) {
    Meteor.call('order.remove', id);
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
    return orderAddress;
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
    return 'None';
  }

  /**
   * Opens modal to select addresses to ship to
   */
  handleOpen = orderId => {
    const { addressId } = find(this.props.orderAddresses, { orderId: orderId });
    const address = find(this.props.addresses, { _id: addressId });
    this.setState({ modalOpen: true, selectedOrderAddress: address });
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
        <Helmet
          title="Orders"
          meta={[
            {
              name: 'description',
              content: 'Lists all associated orders for user',
            },
          ]}
        />
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
                Buy
              </TableHeaderColumn>
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
                {/* Order Owner */}
                <TableRowColumn>{Meteor.user(order.userId).emails[0].address}</TableRowColumn>

                {/* Tracking Link */}
                <TableRowColumn>{this.renderOrderTrackingLink(order)}</TableRowColumn>

                {/* Ordered On */}
                <TableRowColumn>
                  {new Date(order.dateAdded).toLocaleDateString('en-US')}
                </TableRowColumn>

                {/* Product IDs */}
                <TableRowColumn>{JSON.stringify(order.productIds)}</TableRowColumn>

                {/* Status */}
                <TableRowColumn>{order.status}</TableRowColumn>

                {/* View Address */}
                <TableRowColumn>
                  <FlatButton onClick={() => this.handleOpen(order._id)} label="View" />
                </TableRowColumn>

                {/* Buy Shipment */}
                <TableRowColumn>
                  <FlatButton
                    disabled={order.status !== 'Active'}
                    onClick={() => this.buyOrder(order._id)}
                    label="Buy"
                  />
                </TableRowColumn>

                {/* Cancel Order */}
                <TableRowColumn>
                  <FlatButton onClick={() => this.deleteOrder(order._id)} secondary label="X" />
                </TableRowColumn>

                {/* Approve Button */}
                {isMaintainer() && (
                  <TableRowColumn>
                    <FlatButton
                      disabled={order.status === 'Approved'}
                      onClick={() => this.approveOrder(order._id)}
                      secondary
                      label="✓"
                    />
                  </TableRowColumn>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Dialog
          title="Buy Order"
          modal={false}
          open={this.state.modalBuyingOpen}
          onRequestClose={() => this.setState({ modalBuyingOpen: false })}
        >
          {this.state.isBuyingOrder ? (
            <Loader />
          ) : (
            <div>
              <p>This link will expire in 5 minutes</p>
              <p>Please have your Credit Card information ready</p>
              <a href={this.state.paymentUrl} target="_blank">
                <FlatButton label="Continue" />
              </a>
            </div>
          )}
        </Dialog>
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

export default withTracker(props => {
  Meteor.subscribe('addresses');
  Meteor.subscribe('order.trackingId');
  Meteor.subscribe('order.address');
  Meteor.subscribe('orders');

  return {
    addresses: Addresses.find({}).fetch(),
    orders: Order.find({}).fetch(),
    orderAddresses: OrderAddress.find({}).fetch(),
    orderTrackingId: OrderTrackingId.find({}).fetch(),
  };
})(OrdersPage);

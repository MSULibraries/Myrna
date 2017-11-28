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
import TextField from 'material-ui/TextField';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';
import { LeftNav } from './../../components/LeftNav/LeftNav';
import AddressList from './../../components/AddressList/index';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import { isMaintainer } from './../../../../lib/roles';
import Addresses from './../../../api/addresses';
import Order from './../../../api/order/order';
import OrderAddress from './../../../api/order/bridges/orderAddress';
import OrderTrackingId from './../../../api/order/bridges/orderTrackingId';
import { Loader } from './../../components/Loader/index';
import insertOrderCost from './../../../api/order/bridges/orderCost/methods/insertOrderCost/index';

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
      hideInactive: false,
      approvingOrder: false,
      costumeCost: null,
      isBuyingOrder: false,
      modalBuyingOpen: false,
      modalOrderCostOpen: false,
      modalOpen: false,
      orderAddresses: {},
      paymentUrl: null,
      selectedOrderAddress: undefined,
      targetOrderId: null,
    };

    this.approveOrder = this.approveOrder.bind(this);
    this.buyOrder = this.buyOrder.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.filterInactive = this.filterInactive.bind(this);
    this.getOrderAddress = this.getOrderAddress.bind(this);
    this.getOrderAddresses = this.getOrderAddresses.bind(this);
    this.renderOrderTrackingLink = this.renderOrderTrackingLink.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.orders !== nextProps.orders && nextProps.orders.length > 0) {
      this.getOrderAddresses(nextProps.orders);
    }
  }

  approveOrder() {
    this.setState({ approvingOrder: true });

    insertOrderCost.call(
      {
        orderId: this.state.targetOrderId,
        costumeCost: this.state.costumeCost,
      },
      (error, result) => {
        if (!error) {
          Meteor.call('order.approve', this.state.targetOrderId, () => {
            this.setState({ approvingOrder: false });
          });
        } else {
          console.error(error);
        }
      },
    );
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

  reOrderOrder = orderId => {
    Meteor.call('order.reorder', orderId);
  };

  renderOrderTrackingLink({ _id: orderId, status }) {
    if (status !== 'Approved' || status !== 'Un-Approved') {
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

  togglehideInactive() {
    this.setState({
      hideInactive: !this.state.hideInactive,
    });
  }

  filterInactive(order) {
    if (!this.state.hideInactive) {
      return order.status !== 'Complete';
    } else return true;
  }

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
        <Row>
          <LeftNav />
          <Col sm={8}>
            <BreadCrumbs crumbs={['Profile', 'Orders']} />
            <label className="hide-inactive">
              <input
                type="checkbox"
                readOnly
                checked={this.state.hideInactive}
                onClick={this.togglehideInactive.bind(this)}
              />
              Show All Orders
            </label>
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={darkerTableHeaders}>Order Owner</TableHeaderColumn>
                  <TableHeaderColumn style={darkerTableHeaders}>Tracking ID</TableHeaderColumn>
                  <TableHeaderColumn style={darkerTableHeaders}>Ordered On</TableHeaderColumn>
                  <TableHeaderColumn style={darkerTableHeaders}>Details</TableHeaderColumn>
                  <TableHeaderColumn style={darkerTableHeaders}>Status</TableHeaderColumn>
                  <TableHeaderColumn style={{ darkerTableHeaders }}>Address</TableHeaderColumn>
                  <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                    Buy
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                    Cancel
                  </TableHeaderColumn>
                  <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                    Re-Order
                  </TableHeaderColumn>

                  {isMaintainer() && (
                    <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                      Approve
                    </TableHeaderColumn>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.props.orders.filter(order => this.filterInactive(order)).map(order => (
                  <TableRow key={order._id}>
                    {/* Order Owner */}
                    <TableRowColumn>{Meteor.user(order.userId).emails[0].address}</TableRowColumn>

                    {/* Tracking Link */}
                    <TableRowColumn>{this.renderOrderTrackingLink(order)}</TableRowColumn>

                    {/* Ordered On */}
                    <TableRowColumn>
                      {new Date(order.dateAdded).toLocaleDateString('en-US')}
                    </TableRowColumn>

                    {/* Details Link */}
                    <TableRowColumn>
                      <Link to={'/orders/details/' + order._id}>Details</Link>
                    </TableRowColumn>

                    {/* Status */}
                    <TableRowColumn>{order.status}</TableRowColumn>

                    {/* View Address */}
                    <TableRowColumn>
                      <FlatButton onClick={() => this.handleOpen(order._id)} label="View" />
                    </TableRowColumn>

                    {/* Buy Shipment */}
                    <TableRowColumn>
                      <FlatButton
                        disabled={order.status !== 'Approved'}
                        onClick={() => this.buyOrder(order._id)}
                        label="Buy"
                      />
                    </TableRowColumn>

                    {/* Cancel Order */}
                    <TableRowColumn>
                      <FlatButton onClick={() => this.deleteOrder(order._id)} secondary label="X" />
                    </TableRowColumn>

                    {/* Re Order */}
                    <TableRowColumn>
                      <FlatButton
                        disabled={order.status !== 'Complete'}
                        onClick={() => this.reOrderOrder(order._id)}
                        secondary
                        label="Re-Order"
                      />
                    </TableRowColumn>

                    {/* Approve Button */}
                    {isMaintainer() && (
                      <TableRowColumn>
                        {this.state.approvingOrder && order._id === this.state.targetOrderId ? (
                          <Loader />
                        ) : (
                          <FlatButton
                            disabled={order.status !== 'Un-Approved'}
                            onClick={() =>
                              this.setState({
                                targetOrderId: order._id,
                                modalOrderCostOpen: true,
                              })
                            }
                            secondary
                            label="✓"
                          />
                        )}
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
                <div>
                  <p>Preparing Order</p>
                  <Loader />
                </div>
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

            <Dialog
              title="Order Cost"
              modal={false}
              open={this.state.modalOrderCostOpen}
              onRequestClose={() => this.setState({ modalOrderCostOpen: false })}
            >
              <TextField
                onChange={({ target: { value: newCost } }) => {
                  this.setState({ costumeCost: +newCost });
                }}
                hintText="Cost"
                label="Cost"
              />

              <FlatButton
                label="Submit"
                onClick={() => {
                  this.approveOrder();
                  this.setState({ modalOrderCostOpen: false });
                }}
              />
            </Dialog>
          </Col>
        </Row>
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

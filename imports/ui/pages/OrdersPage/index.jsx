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
import { Container } from 'react-grid-system';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import AddressList from './../../components/AddressList/index';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import { isMaintainer } from './../../../../lib/roles';
import Addresses from './../../../api/addresses';
import Order from './../../../api/order/order';
import OrderAddress from './../../../api/order/bridges/orderAddress';
import OrderTrackingId from './../../../api/order/bridges/orderTrackingId';
import { Loader } from './../../components/Loader/index';
import insertOrderCost from './../../../api/order/bridges/orderCost/methods/insertOrderCost/index';
import insertParcelDimensions from './../../../api/order/bridges/orderParcelDimensions/methods/insertParcelDimensions/index';
import findUserById from './../../../api/user/findUserById/index';

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
      costumeCost: '',
      isBuyingOrder: false,
      modalBuyingOpen: false,
      modalOrderCostOpen: false,
      modalOpen: false,
      orderAddresses: {},
      orderOwners: {},
      packageHeight: '',
      packageLength: '',
      packageWeight: '',
      packageWidth: '',
      paymentUrl: null,
      selectedOrder: null,
      selectedOrderAddress: null,
      orderId: null,
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
      this.getOrderOwner(nextProps.orders);
    }
  }

  async approveOrder() {
    this.setState({ approvingOrder: true });

    const addCost = () =>
      new Promise((resolve, reject) => {
        insertOrderCost.call(
          {
            orderId: this.state.orderId,
            costumeCost: this.state.costumeCost,
          },
          error => {
            if (!error) {
              resolve();
            } else {
              reject(error);
            }
          },
        );
      });

    const addDimensions = () =>
      new Promise((resolve, reject) => {
        insertParcelDimensions.call(
          {
            orderId: this.state.orderId,
            height: this.state.packageHeight,
            length: this.state.packageLength,
            weight: this.state.packageWeight,
            width: this.state.packageWidth,
          },
          error => {
            if (!error) {
              resolve();
            } else {
              reject(error);
            }
          },
        );
      });
    const updateStatus = () =>
      new Promise((resolve, reject) => {
        Meteor.call('order.approve', this.state.orderId, error => {
          if (!error) {
            resolve();
          } else {
            reject(error);
          }
        });
      });

    await addCost();

    //Only need to add dimensions to orders that will be shipped
    if (!this.state.selectedOrder.isPickUp) {
      await addDimensions();
    }
    await updateStatus();

    this.setState({ approvingOrder: false });
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
    this.setState({ modalOpen: false, selectedOrderAddress: null });
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

  getOrderOwner = orders => {
    // Pull the order's owner from each order
    orders.map(({ _id: orderId, userId }) => {
      let email;
      if (isMaintainer()) {
        findUserById.call({ id: userId }, (error, resp) => {
          if (!error && resp) {
            email = resp.emails[0].address;
            this.setState({ orderOwners: { [orderId]: email, ...this.state.orderOwners } });
          }
        });
      } else {
        // Just use the current user's email
        email = Meteor.user().emails[0].address;
        this.setState({ orderOwners: { [orderId]: email } });
      }
    });
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
                <TableRowColumn> {this.state.orderOwners[order._id]}</TableRowColumn>

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
                    {this.state.approvingOrder && order._id === this.state.orderId ? (
                      <Loader />
                    ) : (
                      <FlatButton
                        disabled={order.status !== 'Un-Approved'}
                        onClick={() =>
                          this.setState({
                            orderId: order._id,
                            modalOrderCostOpen: true,
                            selectedOrder: order,
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
          onRequestClose={() => this.setState({ modalOrderCostOpen: false, orderId: null })}
          style={{ overflow: 'scroll' }}
        >
          <h2>Costume Cost</h2>
          <TextField
            fullWidth
            onChange={({ target: { value: newCost } }) => {
              const re = /^\d{0,2}?.\d{0,2}$/;
              if (newCost === '' || (re.test(newCost) && !isNaN(newCost))) {
                this.setState({ costumeCost: newCost });
              }
            }}
            floatingLabelText="Dollar Amount"
            label="Dollar Amount"
            value={this.state.costumeCost}
          />

          <h2>Shipping Info</h2>
          {this.state.selectedOrder && this.state.selectedOrder.isPickUp === false ? (
            <div>
              <h3>Package Dimensions</h3>
              <TextField
                fullWidth
                onChange={({ target: { value: newWidth } }) => {
                  //Numbers only
                  const re = /^\d+$/;

                  if (newWidth == '' || re.test(newWidth)) {
                    this.setState({ packageWidth: +newWidth });
                  }
                }}
                floatingLabelText="Width"
                value={this.state.packageWidth}
              />
              <br />
              <TextField
                fullWidth
                onChange={({ target: { value: newLength } }) => {
                  //Numbers only
                  const re = /^\d+$/;

                  if (newLength == '' || re.test(newLength)) {
                    this.setState({ packageLength: +newLength });
                  }
                }}
                floatingLabelText="Length"
                label="Length"
                value={this.state.packageLength}
              />
              <br />
              <TextField
                fullWidth
                onChange={({ target: { value: newHeight } }) => {
                  //Numbers only
                  const re = /^\d+$/;

                  if (newHeight == '' || re.test(newHeight)) {
                    this.setState({ packageHeight: +newHeight });
                  }
                }}
                floatingLabelText="Height"
                label="Height"
                value={this.state.packageHeight}
              />
              <br />
              <em>*Dimensions are in inches</em>
              <br />
              <h3>Weight</h3>
              <TextField
                fullWidth
                onChange={({ target: { value: newWeight } }) => {
                  //Numbers only
                  const re = /^\d+$/;

                  if (newWeight == '' || re.test(newWeight)) {
                    this.setState({ packageWeight: +newWeight });
                  }
                }}
                floatingLabelText="Pounds"
                label="Pounds"
                value={this.state.packageWeight}
              />
              <br />
            </div>
          ) : (
            <p>
              <em>This is a pick up order and does not need shipment info. </em>
            </p>
          )}
          <FlatButton
            label="Submit"
            onClick={() => {
              this.approveOrder();
              this.setState({ modalOrderCostOpen: false });
            }}
          />
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

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

import PickAddress from './PickAddress';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import Cart from './../../../api/cart';

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

class CartPage extends Component {
  constructor() {
    super();
    this.state = {
      modalOpen: false,
      selectedAddressId: null,
    };
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.selectAddress = this.selectAddress.bind(this);
    this.startOrder = this.startOrder.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.submitOrderSuccess = this.submitOrderSuccess.bind(this);
  }

  /**
   * Opens modal to select addresses to ship to
   */
  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  /**
   * Closes modal to select addresses to ship to
   */
  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  /**
   * Removes product from user's cart collection
   */
  removeProductFromCart(id) {
    Meteor.call('cart.remove', id);
  }
  /**
   * Asks user what address to use and then submits order with that address
   * @param {string} id 
   */
  selectAddress(id) {
    this.setState({
      selectedAddressId: id,
    });
    this.submitOrder(id);
    this.handleClose();
  }

  /**
   * Driver for submitting an order
   */
  startOrder() {
    this.handleOpen();
  }

  /**
   * Inserts order information into order and order.address collections
   */
  submitOrder() {
    const orderId = Meteor.call('order.insert', (error, orderId) => {
      Meteor.call('order.address.insert', orderId, this.state.selectedAddressId, (err, result) => {
        if (!err) {
          this.submitOrderSuccess();
        }
      });
    });
  }

  submitOrderSuccess() {
    alert('Order Submitted!');
  }

  render() {
    return (
      <Container>
        <h1>Cart</h1>
        <BreadCrumbs crumbs={['Profile', 'Cart']} />

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={darkerTableHeaders}>Product ID</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>User ID</TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>Added On </TableHeaderColumn>

              <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                Remove
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.cartItems.map(item => (
              <TableRow key={item._id}>
                <TableRowColumn>{item.productId}</TableRowColumn>
                <TableRowColumn>{item.userId}</TableRowColumn>
                <TableRowColumn>{item.dateAdded}</TableRowColumn>
                <TableRowColumn style={centerColumn}>
                  <FlatButton
                    onClick={() => this.removeProductFromCart(item._id)}
                    secondary
                    label="X"
                  />
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          title="Pick Address"
          modal={false}
          open={this.state.modalOpen}
          onRequestClose={this.handleClose}
        >
          <PickAddress selectAddress={address => this.selectAddress(address)} />
        </Dialog>

        {/* Only allow submit if there are items in the cart  */}
        {this.props.cartItems.length > 0 && (
          <FlatButton onClick={() => this.startOrder()} label="Submit Order" />
        )}
      </Container>
    );
  }
}

CartPage.defaultProps = {
  cartItems: [],
};

CartPage.proptypes = {
  cartItems: PropTypes.array,
};

export default (CartPage = createContainer(() => {
  Meteor.subscribe('cart');
  return {
    cartItems: Cart.find({}).fetch(),
  };
}, CartPage));

/**
 * Displays the items a user has added to their cart
 * When a user clicks the submit order button, they will
 * will start going through 'steps' of submitting an order
 */

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
import { Link } from 'react-router-dom';

import InputSpecialInstructions from './InputSpecialInstructions';
import PickAddress from './PickAddress';
import PickOrderDates from './PickOrderDates';
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

export class CartPage extends Component {
  constructor() {
    super();
    this.state = {
      dateToArrive: undefined,
      dateToShipBack: undefined,
      modalOpen: false, // modal is open
      selectedAddressId: undefined, // Id of order to ship to
      specialInstr: '', // Special Instr. for Order
      step: 0, // The current step of the create order process
      /**
      * Number of inputs after user hits submit
      * @example: We need toAddress, dates, and specialInstr
      *           So there would be three steps
      */
      totalSteps: 3,
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.incStep = this.incStep.bind(this);
    this.decStep = this.decStep.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.setSpecialIntr = this.setSpecialIntr.bind(this);
    this.setOrderDates = this.setOrderDates.bind(this);
    this.startOrder = this.startOrder.bind(this);
    this.submitOrder = this.submitOrder.bind(this);
    this.submitOrderSuccess = this.submitOrderSuccess.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    // If user has gone through all the steps
    if (this.state.step > this.state.totalSteps) {
      // Finish Order and Reset
      this.finishOrder();
    }
  }

  /**
   * Decreases the current step counter
   */
  decStep = () => {
    this.setState({ step: this.state.step - 1 });
  };

  /**
  * Driver for finishing and submitting an order
  * Calls function to save order to DB
  * Closes Modal
  */
  finishOrder() {      
    this.setState({ step: 0 });
    this.submitOrder(
      this.state.dateToArrive,
      this.state.dateToShipBack,
      this.state.specialInstr,
      this.state.selectedAddressId,
    );
  }

  /**
   * Closes modal to select addresses to ship to
   * Resets steps back to 0
   * Reset selectedAddressId
   */
  handleClose = () => {
    this.setState({ modalOpen: false });
  };

  /**
   * Opens modal to select addresses to ship to
   */
  handleOpen = () => {
    this.setState({ modalOpen: true });
  };

  /**
   * Increases the current step counter
   */
  incStep = () => {
    this.setState({ step: this.state.step + 1 });
  };

  /**
   * Removes product from user's cart collection
   */
  removeProductFromCart(id) {
    Meteor.call('cart.remove', id);
  }

  /**
   * Sets state to the user's selected addressId
   * Increments step
   * @param {string} id
   */
  selectAddress(id) {
    this.setState({
      selectedAddressId: id,
    });
    this.incStep();
  }

  /**
 * When a user submits their dates,
 * set the state to those dates
 * then increments step
 */
  setOrderDates(dateToArrive, dateToShipBack) {
    this.setState({ dateToArrive, dateToShipBack });
    this.incStep();
  }

  setSpecialIntr(text) {
    this.setState({ specialInstr: text });
    this.incStep();
  }

  /**
   * Driver for submitting an order
   */
  startOrder() {
    this.handleOpen();
    this.incStep();
  }

  /**
   * Inserts order information into order and order.address collections
   */
  submitOrder(dateToArrive, dateToShipBack, specialInstr, selectedAddressId) {
    this.handleClose();
    Meteor.call('order.insert', dateToArrive, dateToShipBack, specialInstr, (err, orderId) => {
      if (err) {
        console.error(err);
      } else {
        this.submitOrderSuccess();
        Meteor.call('order.address.insert', orderId, selectedAddressId, (err, result) => {
          if (!err) {
            this.setState({ steps: 0 });
          }
        });
      }
    });
  }

  submitOrderSuccess() {
    alert('Order Submitted!');
  }

  renderStep(step = this.state.step) {
    switch (step) {
      case 1: {
        return (
          <Dialog
            title="Pick Address"
            modal={false}
            open={this.state.modalOpen}
            onRequestClose={this.handleClose}
          >
            <PickAddress selectAddress={address => this.selectAddress(address)} />
          </Dialog>
        );
      }
      case 2: {
        return (
          <Dialog
            title="Pick Order Dates"
            modal={false}
            open={this.state.modalOpen}
            onRequestClose={this.handleClose}
          >
            <PickOrderDates
              setOrderDates={(dateToArriveBy, dateToShipBack) => {
                this.setOrderDates(dateToArriveBy, dateToShipBack);
              }}
            />
          </Dialog>
        );
      }
      case 3: {
        return (
          <Dialog
            title="Special Instructions"
            modal={false}
            open={this.state.modalOpen}
            onRequestClose={this.handleClose}
          >
            <InputSpecialInstructions setSpecialIntr={text => this.setSpecialIntr(text)} />
          </Dialog>
        );
      }
    }
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
        <p>
          <em>
            By placing an order, you are agreeing to our <Link to="policies">policies</Link>
          </em>
        </p>
        {/* Only allow submit if there are items in the cart  */}
        {this.props.cartItems.length > 0 && (
          <FlatButton onClick={() => this.startOrder()} label="Submit Order" />
        )}

        {/* Rendering the current step if availible */}
        {this.renderStep()}
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

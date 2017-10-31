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
import NewShowPrompt from './NewShowPrompt';
import PickAddress from './PickAddress';
import PickOrderDates from './PickOrderDates';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import Toast from './../../components/Toast/index';
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
      newShowModalOpen: false, // modal for entering a new show is open
      orderModalOpen: false, // modal for new order is open
      selectedAddressId: undefined, // Id of order to ship to
      specialInstr: '', // Special Instr. for Order
      step: 0, // The current step of the create order process
      toasting: false, // small toast is open at the bottom
      toastMessage: undefined, // message to appear in toast
      /**
      * Number of inputs after user hits submit
      * @example: We need toAddress, dates, and specialInstr
      *           So there would be three steps
      */
      totalSteps: 3,
    };

    this.createNewShow = this.createNewShow.bind(this);
    this.decStep = this.decStep.bind(this);
    this.openNewOrderModal = this.openNewOrderModal.bind(this);
    this.openToast = this.openToast.bind(this);
    this.closeNewOrderModal = this.closeNewOrderModal.bind(this);
    this.closeToast = this.closeToast.bind(this);
    this.incStep = this.incStep.bind(this);
    this.removeProductFromCart = this.removeProductFromCart.bind(this);
    this.renderStep = this.renderStep.bind(this);
    this.setSpecialIntr = this.setSpecialIntr.bind(this);
    this.setNewShowName = this.setNewShowName.bind(this);
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

  createNewShow() {
    this.setState({ newShowModalOpen: true });
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
  closeNewOrderModal = () => {
    this.setState({ orderModalOpen: false, step: 0 });
  };

  closeToast() {
    this.setState({ toasting: false });
  }

  /**
   * Opens modal to select addresses to ship to
   */
  openNewOrderModal = () => {
    this.setState({ orderModalOpen: true });
  };

  openToast(message) {
    this.setState({
      toasting: true,
      toastMessage: message,
    });
  }

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

  setNewShowName(showName) {
    const cartProductIds = this.props.cartItems.map(item => item._id);
    Meteor.call('show.insert', showName, cartProductIds, err => {
      if (!err) {
        this.openToast(`'${showName}' Made`);
      } else {
        console.error(err);
      }
    });
    this.setState({ newShowModalOpen: false });
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
    this.openNewOrderModal();
    this.incStep();
  }

  /**
   * Inserts order information into order and order.address collections
   */
  submitOrder(dateToArrive, dateToShipBack, specialInstr, selectedAddressId) {
    this.closeNewOrderModal();
    Meteor.call('order.insert', dateToArrive, dateToShipBack, specialInstr, (err, orderId) => {
      if (err) {
        console.error(err);
      } else {
        this.submitOrderSuccess();
        Meteor.call('order.address.insert', orderId, selectedAddressId, (err, result) => {
          if (!err) {
            this.setState({
              steps: 0,
            });
            this.openToast('Order Submitted');
          }
        });
      }
    });
  }

  submitOrderSuccess() {}

  renderNewShowPrompt() {
    return (
      <Dialog
        title="New Show"
        modal={false}
        open={this.state.newShowModalOpen}
        onRequestClose={() => this.setState({ newShowModalOpen: false })}
      >
        <NewShowPrompt setNewShowName={newShowName => this.setNewShowName(newShowName)} />
      </Dialog>
    );
  }

  renderStep(step = this.state.step) {
    switch (step) {
      case 1: {
        return (
          <Dialog
            title="Pick Address"
            modal={false}
            open={this.state.orderModalOpen}
            onRequestClose={this.closeNewOrderModal}
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
            open={this.state.orderModalOpen}
            onRequestClose={this.closeNewOrderModal}
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
            open={this.state.orderModalOpen}
            onRequestClose={this.closeNewOrderModal}
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
          <div>
            <FlatButton onClick={() => this.startOrder()} label="Submit Order" />
            <FlatButton secondary onClick={() => this.createNewShow()} label="Create a Show" />
          </div>
        )}

        {/* Rendering the current step if availible */}
        {this.renderStep()}

        {this.renderNewShowPrompt()}
        {this.state.toasting && (
          <Toast
            open={this.state.toasting}
            message={this.state.toastMessage}
            closeToast={() => this.closeToast()}
          />
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

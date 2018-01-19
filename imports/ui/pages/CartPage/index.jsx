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
import Toggle from 'material-ui/Toggle';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Col, Container, Row } from 'react-grid-system';
import Helmet from 'react-helmet';
import { Link } from 'react-router-dom';

import InputSpecialInstructions from './InputSpecialInstructions';
import NewShowPrompt from './NewShowPrompt';
import PickAddress from './PickAddress';
import PickOrderDates from './PickOrderDates';
import PullShowPrompt from './PullShowPrompt';
import LeftNav from './../../components/LeftNav/LeftNav';
import BreadCrumbs from './../../components/BreadCrumbs/index';
import Toast from './../../components/Toast/index';
import Cart from './../../../api/cart';
import { getProductAvailibility } from './../../../api/ItemDesc/methods/getProductAvailibility/index';
import Show from './../../../api/show';
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
      isPickupOrder: false,
      itemsAvailible: {},
      newShowModalOpen: false, // modal for entering a new show is open
      orderModalOpen: false, // modal for new order is open
      pullShowModalOpen: false,
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
      totalSteps: 4,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.cartItems !== prevProps.cartItems) {
      this.getProductAvailibility();
    }

    // If user has gone through all the steps
    if (this.state.step > this.state.totalSteps) {
      // Finish Order and Reset
      this.finishOrder();
    }
  }

  /**
   * If the cart items availibility is loaded,
   * returns whether all the items are availible
   * @returns bool
   */
  cartHasUnAvailibleItems() {
    if (Object.keys(this.state.itemsAvailible).length > 0) {
      let cartHasUnAvailibleItems = false;
      Object.keys(this.state.itemsAvailible).forEach(productId => {
        cartHasUnAvailibleItems = !this.state.itemsAvailible[productId];
      });
      return cartHasUnAvailibleItems;
    } else {
      return false;
    }
  }

  clearCart = () => {
    Meteor.call('cart.clear');
  };

  createNewShow = () => {
    this.setState({ newShowModalOpen: true });
  };

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
  finishOrder = () => {
    this.setState({ step: 0 });
    this.submitOrder(
      this.state.dateToArrive,
      this.state.dateToShipBack,
      this.state.isPickupOrder,
      this.state.specialInstr,
      this.state.selectedAddressId,
    );
  };

  getProductAvailibility = () => {
    getProductAvailibility.call(
      {
        productIds: this.props.cartItems.map(({ productId }) => productId),
      },
      (error, result) => {
        this.setState({
          itemsAvailible: result,
        });
      },
    );
  };

  /**
   * Closes modal to select addresses to ship to
   * Resets steps back to 0
   * Reset selectedAddressId
   */
  closeNewOrderModal = () => {
    this.setState({ orderModalOpen: false, step: 0 });
  };

  closeToast = () => {
    this.setState({ toasting: false });
  };

  /**
   * Opens modal to select addresses to ship to
   */
  openNewOrderModal = () => {
    this.setState({ orderModalOpen: true });
  };

  openToast = message => {
    this.setState({
      toasting: true,
      toastMessage: message,
    });
  };

  /**
   * Increases the current step counter
   */
  incStep = () => {
    this.setState({ step: this.state.step + 1 });
  };

  pullShow = () => {
    this.setState({ pullShowModalOpen: true });
  };

  /**
   * Removes product from user's cart collection
   */
  removeProductFromCart = id => {
    Meteor.call('cart.remove', id);
  };

  /**
   * Sets state to the user's selected addressId
   * Increments step
   * @param {string} id
   */
  selectAddress = id => {
    this.setState({
      selectedAddressId: id,
    });
    this.incStep();
  };

  setNewShowName = showName => {
    const cartProductIds = this.props.cartItems.map(item => item.productId);
    Meteor.call('show.insert', showName, cartProductIds, err => {
      if (!err) {
        this.openToast(`'${showName}' Made`);
      } else {
        console.error(err);
      }
    });
    this.setState({ newShowModalOpen: false });
  };

  /**
   * When a user submits their dates,
   * set the state to those dates
   * then increments step
   */
  setOrderDates = (dateToArrive, dateToShipBack) => {
    this.setState({ dateToArrive, dateToShipBack });
    this.incStep();
  };

  setSpecialIntr = text => {
    this.setState({ specialInstr: text });
    this.incStep();
  };

  /**
   * Driver for submitting an order
   */
  startOrder = () => {
    this.openNewOrderModal();
    this.incStep();
  };

  /**
   * Inserts order information into order and order.address collections
   */
  submitOrder = (dateToArriveBy, dateToShipBack, isPickUp, specialInstr, selectedAddressId) => {
    this.closeNewOrderModal();
    Meteor.call(
      'order.insert',
      {
        dateToArriveBy,
        dateToShipBack,
        isPickUp,
        specialInstr,
      },
      (err, orderId) => {
        if (err) {
          console.error(err);
        } else {
          Meteor.call('order.address.insert', orderId, selectedAddressId, (err, result) => {
            if (!err) {
              this.setState({
                steps: 0,
              });
              this.openToast('Order Submitted');
            }
          });
        }
      },
    );
  };

  renderPullShow = () => {
    return (
      <Dialog
        title="Pull Show"
        modal={false}
        open={this.state.pullShowModalOpen}
        onRequestClose={() => this.setState({ pullShowModalOpen: false })}
      >
        <PullShowPrompt close={() => this.setState({ pullShowModalOpen: false })} />
      </Dialog>
    );
  };

  renderNewShowPrompt = () => {
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
  };

  renderStep = (step = this.state.step) => {
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
      case 4: {
        return (
          <Dialog
            title="Shipment"
            modal={false}
            open={this.state.orderModalOpen}
            onRequestClose={this.closeNewOrderModal}
          >
            <div style={{ width: '50%' }}>
              <p>Are you going to pick up the order in person? </p>
              <Toggle
                label={this.state.isPickupOrder ? 'Yes' : 'No'}
                defaultToggled={false}
                onToggle={(event, checked) => {
                  this.setState({ isPickupOrder: checked });
                }}
              />
              <FlatButton label="Continue" onClick={() => this.incStep()} />
            </div>
          </Dialog>
        );
      }
    }
  };

  render() {
    return (
      <Container>
        <Helmet
          title="Cart"
          meta={[
            {
              name: 'description',
              content: "Displays all items in a user's cart",
            },
          ]}
        />
        <h1>Cart</h1>
        <Row>
          <Col sm={3}>
            <LeftNav />
          </Col>
          <Col sm={8}>
            <BreadCrumbs crumbs={['Profile', 'Cart']} />
            <Table>
              <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={darkerTableHeaders}>Status</TableHeaderColumn>
                  <TableHeaderColumn style={darkerTableHeaders}>Added On </TableHeaderColumn>

                  <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                    Remove
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {this.props.cartItems.map(item => (
                  <TableRow key={item._id}>
                    <TableRowColumn>
                      {this.state.itemsAvailible && this.state.itemsAvailible[item.productId] ? (
                        <span> Availible</span>
                      ) : (
                          <span> Un-Availible</span>
                        )}
                    </TableRowColumn>
                    <TableRowColumn>
                      {new Date(item.dateAdded).toLocaleDateString('en-US')}
                    </TableRowColumn>
                    <TableRowColumn style={centerColumn}>
                      <FlatButton
                        onClick={() => this.removeProductFromCart(item._id)}
                        secondary
                        style={{ margin: 'auto' }}
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
            <FlatButton onClick={() => this.pullShow()} label="Pull a Show" />

            {/*
          Only allow submit or create show 
          if there are items in the cart  
          */}
            {this.props.cartItems.length > 0 && (
              <span>
                <FlatButton
                  disabled={this.cartHasUnAvailibleItems()}
                  onClick={() => this.startOrder()}
                  label="Submit Order"
                />
                <FlatButton secondary onClick={() => this.createNewShow()} label="Create a Show" />
                <FlatButton secondary onClick={() => this.clearCart()} label="Clear Cart" />
              </span>
            )}

            {/* Displaying warning if a user has 'Un-Availible' items in their cart */}
            {this.cartHasUnAvailibleItems() && (
              <div>
                <em>Please remove the 'Un-Availible' items from your cart before ordering</em>
              </div>
            )}

            {this.renderPullShow()}
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
          </Col>
        </Row>
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

export default withTracker(props => {
  Meteor.subscribe('cart');
  Meteor.subscribe('show');

  return {
    shows: Show.find({ ownerId: Meteor.userId() }).fetch(),
    cartItems: Cart.find({}).fetch(),
  };
})(CartPage);

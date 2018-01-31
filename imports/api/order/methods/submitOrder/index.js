/**
 * Adds a new order to the collection
 * Sets status to 'Un-Approved' by default so that
 * a maintainer can approve the order
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Order } from './../../order';
import { getProductAvailibility } from './../../../ItemDesc/methods/getProductAvailibility/index';
import { setAvailible } from './../../../ItemDesc/methods/setAvailible/index';
import { emailOrderedPlaced } from './../emails/orderPlaced/';

export const submitOrder = new ValidatedMethod({
  name: 'order.insert',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'Error in submitOrder: You must be logged in to submit an order',
  },
  validate: new SimpleSchema({
    dateToArriveBy: { type: Date },
    dateToShipBack: { type: Date },
    isPickUp: { type: Boolean },
    specialInstr: { type: String, optional: true },
  }).validator(),

  run({
    dateToArriveBy, dateToShipBack, isPickUp, specialInstr,
  }) {
    const { userId } = this;
    // Getting all item information from cart
    const cartProductIds = Meteor.call('cart.read.productIds');

    const productAvailibility = getProductAvailibility._execute(
      { userId: this.userId },
      { productIds: cartProductIds },
    );

    let allProductsAvailible = true;
    const unAvailibleProducts = [];

    Object.keys(productAvailibility).forEach((productId) => {
      if (!productAvailibility[productId]) {
        unAvailibleProducts.push(productId);
        allProductsAvailible = false;
      }
    });

    if (allProductsAvailible !== true) {
      throw new Meteor.Error(
        'Un-Availible-Product',
        'Products in cart are not availible',
        unAvailibleProducts,
      );
    }

    const orderId = Order.insert(
      {
        userId,
        dateAdded: Date.now(),
        dateToArriveBy,
        dateToShipBack,
        isPickUp,
        productIds: cartProductIds,
        status: 'Un-Approved',
        specialInstr,
      },
      (error) => {
        if (!error) {
          // Waiting on this. This causes failures for order.insert sometimes
          // because the test aren't waiting for this to finish
          // Meteor.call('cart.clear');
        }
      },
    );
    // Clearing cart after the order has been placed
    Meteor.call('cart.clear');

    // Emailing maintainers to let them know there is a new order to be 'Approved'
    emailOrderedPlaced.call({ orderId });

    // Making items unavailible since they are part of an order now
    setAvailible.call({ itemIds: cartProductIds, isAvailible: false });
    return orderId;
  },
});

export default submitOrder;

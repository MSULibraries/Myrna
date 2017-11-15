/**
* Adds a new order to the collection
* Sets status to 'Un-Approved' by default so that
* a maintainer can approve the order
*/

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Order } from './../../order';
import { setAvailible } from './../../../ItemDesc/methods/setAvailible/index';

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
    Meteor.call('cart.clear');

    // Making items unavailible since they are part of an order now
    setAvailible.call({ itemIds: cartProductIds, isAvailible: false });
    return orderId;
  },
});

export default submitOrder;
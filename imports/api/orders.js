import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import roles from './../../lib/roles';

export const Order = new Mongo.Collection('orders');

const orderSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'userId',
  },
  dateAdded: {
    type: Date,
    label: 'dateAdded',
  },
  productIds: {
    type: [String],
    label: 'productIds',
  },
  status: {
    allowedValues: ['Active', 'Cancelled', 'Complete', 'Un-Approved'],
    type: String,
    label: 'status',
  },
});

Order.attachSchema(orderSchema);

Order.allow({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('orders', () => {
    // If a maintainer, you get to see all the orders
    if (Roles.userIsInRole(Meteor.userId(), roles.maintainers)) {
      return Order.find({});
    }
    // Only return a user's ordered items
    return Order.find({ userId: Meteor.userId() });
  });
}

/**
 * @returns {bool}
 */
function userLoggedIn() {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
    return false;
  }
  return true;
}

Meteor.methods({
  'order.approve': function orderApprove(orderId) {
    if (userLoggedIn) {
      Order.update({ _id: orderId }, { $set: { status: 'Active' } });
    }
  },

  /**
   * Changes the status of an order to cancelled
   * @param {string} orderId - id of the order
   */
  'order.cancel': function orderCancel(orderId) {
    if (userLoggedIn) {
      check(orderId, String);

      Order.update({ _id: orderId }, { $set: { status: 'Cancelled' } });
    }
  },

  /**
   * Removes an orders entry from the collection
   * @param {string} orderId - id of the order
   */
  'order.delete': function orderDelete(orderId) {
    check(orderId, String);
    if (userLoggedIn) {
      Order.remove({ _id: orderId });
    }
  },

  /**
   * Adds a new order to the collection
   */
  'order.insert': function orderInsert() {
    if (userLoggedIn()) {
      // Getting all item information from cart
      const cartProductIds = Meteor.call('cart.read.productIds');

      Order.insert({
        userId: Meteor.userId(),
        dateAdded: Date.now(),
        productIds: cartProductIds,
        status: 'Un-Approved',
      });
      Meteor.call('cart.clear');
    }
  },
});

export default Order;

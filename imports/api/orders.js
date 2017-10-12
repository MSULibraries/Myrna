import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

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
    allowedValues: ['Complete', 'Active', 'Cancelled'],
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
  Meteor.publish('orders', () =>
    // Only return a user's ordered items
    Order.find({ userId: Meteor.userId() }));
}

Meteor.methods({
  /**
   * Changes the status of an order to cancelled
   * @param {string} orderId - id of the order
   */
  'order.cancel': function orderCancel(orderId) {
    check(orderId, String);

    Order.update({ _id: orderId }, { $set: { status: 'Cancelled' } });
  },

  /**
   * Removes an orders entry from the collection
   * @param {string} orderId - id of the order
   */
  'order.delete': function orderDelete(orderId) {
    check(orderId, String);

    Order.remove({ _id: orderId });
  },

  /**
   * Adds a new order to the collection
   */
  'order.insert': function orderInsert() {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // Getting all item information from cart
    const cartProductIds = Meteor.call('cart.read.productIds');
    Order.insert({
      userId: Meteor.userId(),
      dateAdded: Date.now(),
      productIds: cartProductIds,
      status: 'Active',
    });
    Meteor.call('cart.clear');
  },
});

export default Order;

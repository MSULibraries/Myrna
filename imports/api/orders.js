import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Cart } from './cart';

export const Order = new Mongo.Collection('orders');

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
  'order.insert': function orderInsert() {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // Getting all item information from cart
    const cartProductIds = Meteor.call('cart.read');
    // order.insert({
    //   userId: Meteor.userId(),
    //   dateAdded: Date.now(),
    // });
    Meteor.call('cart.clear');
  },
  'order.remove': function orderRemove(orderId) {
    check(orderId, String);

    Order.remove(orderId);
  },
});

export default Order;

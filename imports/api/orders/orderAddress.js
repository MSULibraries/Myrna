import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { roles } from './../../../lib/roles';

export const OrderAddress = new Mongo.Collection('order.address');

const orderAddressSchema = new SimpleSchema({
  orderId: {
    type: String,
    label: 'userId',
  },
  addressId: {
    type: String,
    label: 'dateAdded',
  },
  dateAdded: {
    type: Date,
    label: 'dateAdded',
  },
});

OrderAddress.attachSchema(orderAddressSchema);

OrderAddress.allow({
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
  Meteor.publish('order.address', () => {
    // If a maintainer, you get to see all the orders addresses
    if (Roles.userIsInRole(Meteor.userId(), roles.maintainers)) {
      return OrderAddress.find({});
    }
    // Only return a user's ordered items
    return OrderAddress.find({ userId: Meteor.userId() });
  });
}

/**
 * @returns {bool}
 */
function userLoggedIn() {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
  return true;
}

Meteor.methods({
  'order.address.insert': function orderAddressInsert(orderId, addressId) {
    if (userLoggedIn()) {
      const newOrderAddress = {
        orderId,
        addressId,
        dateAdded: new Date(),
      };

      check(orderId, String);
      check(addressId, String);
      check(newOrderAddress, orderAddressSchema);
      OrderAddress.insert(newOrderAddress);
    }
  },
  'order.address.remove': function orderAddressApprove(id) {
    if (userLoggedIn()) {
      check(id, String);

      OrderAddress.remove({ _id: id });
    }
  },
  'order.address.remove.by.orderId': function orderAddressApprove(orderId) {
    if (userLoggedIn()) {
      check(orderId, String);

      OrderAddress.remove({ orderId });
    }
  },
});

export default OrderAddress;

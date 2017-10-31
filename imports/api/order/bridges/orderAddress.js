import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Order } from './../order';
import { isMaintainer } from './../../../../lib/roles';

export const OrderAddress = new Mongo.Collection('order.address');

OrderAddress.helpers({
  address() {},
});

const orderAddressSchema = new SimpleSchema({
  orderId: {
    type: String,
    label: 'Order Id',
  },
  addressId: {
    type: String,
    label: 'Address Id',
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
  Meteor.publish('order.address', () => {
    if (isMaintainer()) {
      return OrderAddress.find({});
    }
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return OrderAddress.find({
      orderId: {
        $in: usersOrderIds,
      },
    });
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

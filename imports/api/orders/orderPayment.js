import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Order } from './orders';
import { isMaintainer } from './../../../lib/roles';

export const OrderPayment = new Mongo.Collection('order.payment');

const orderPaymentSchema = new SimpleSchema({
  orderId: {
    type: String,
    label: 'Order Id',
  },
  paymentUrl: {
    type: String,
    label: 'URL that leads to site to pay for product',
  },
  dateAdded: {
    type: Date,
    label: 'Date Order Payment Info was Added',
  },
});

OrderPayment.allow({
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
  Meteor.publish('order.payment', () => {
    if (isMaintainer()) {
      return OrderPayment.find({});
    }
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return OrderPayment.find({
      orderId: {
        $in: usersOrderIds,
      },
    });
  });
}

Meteor.methods({
  'order.payment.insert': function orderPaymentInsert(orderId, paymentUrl) {
    // Checking Input Var Types
    check(orderId, String);
    check(paymentUrl, String);
    const newOrderPayment = {
      orderId,
      paymentUrl,
      dateAdded: new Date(),
    };
    check(newOrderPayment, orderPaymentSchema);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    OrderPayment.insert(newOrderPayment);
  },
  'order.payment.remove': function orderPaymentRemove(id) {
    check(id, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    OrderPayment.remove(id);
  },
  'order.payment.remove.by.orderId': function orderPaymentRemove(orderId) {
    check(orderId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    OrderPayment.remove({ orderId });
  },
});

export default OrderPayment;

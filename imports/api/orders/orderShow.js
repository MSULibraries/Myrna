import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Order } from './orders';
import { isMaintainer } from './../../../lib/roles';

export const OrderShow = new Mongo.Collection('order.show');

const orderShowSchema = new SimpleSchema({
  orderId: {
    type: String,
    label: 'User Id',
  },
  showId: {
    type: String,
    label: 'Show Id',
  },
  dateAdded: {
    type: Date,
    label: 'Date Order Show was Added',
  },
});

OrderShow.allow({
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
  Meteor.publish('order.show', () => {
    if (isMaintainer()) {
      return OrderShow.find({});
    }
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return OrderShow.find({
      orderId: {
        $in: usersOrderIds,
      },
    });
  });
}

Meteor.methods({
  'order.show.insert': function orderShowInsert(orderId, showId) {
    // Checking Input Var Types
    check(orderId, String);
    check(showId, String);
    const newOrderShow = {
      orderId,
      showId,
      dateAdded: new Date(),
    };
    check(newOrderShow, orderShowSchema);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    OrderShow.insert(newOrderShow);
  },
  'order.show.remove': function orderShowRemove(id) {
    check(id, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    OrderShow.remove(id);
  },
});

export default OrderShow;

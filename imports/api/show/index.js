/**
 * A Show is a collection of products put together by a customer
 * They can be used to quickly pull many products for a show/production
 * that is going to be repeated
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Order } from './../order/order';
import { isMaintainer } from './../../../lib/roles';

export const Show = new Mongo.Collection('show');

const showSchema = new SimpleSchema({
  name: { type: String, label: 'company', optional: false },
  productIds: { type: [String], label: 'Array of ProductIds belonging to a show' },
  createdAt: { type: Date, label: 'createdAt', optional: false },
  ownerId: { type: String, label: 'ownerId', optional: false },
});

Show.attachSchema(showSchema);

if (Meteor.isServer) {
  // Can see all shows if maintainer
  Meteor.publish('show', () => {
    if (isMaintainer()) {
      return Show.find({});
    }
    // User's can only see their own shows
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return Show.find({ orderId: { $in: usersOrderIds } });
  });
}

Meteor.methods({
  'show.insert': function showInsert(name, productIds) {
    // Checking Input Var Types
    check(name, String);
    check(productIds, Array);
    const newShow = {
      name,
      productIds,
      createdAt: new Date(),
      ownerId: Meteor.userId(),
    };
    check(newShow, showSchema);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Show.insert(newShow);
  },
  'show.read': function showRead(showId) {
    check(showId, String);
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    return Show.findOne({ _id: showId });
  },
  'show.remove': function showRemove(showId) {
    check(showId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Show.remove(showId);
  },
});

export default Show;

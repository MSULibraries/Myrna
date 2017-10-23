import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

/**
 * @returns {bool}
 */
function userLoggedIn() {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
  return true;
}

export const OrderTrackingId = new Mongo.Collection('order.trackingId');

const OrderTrackingIdSchema = new SimpleSchema({
  orderId: {
    type: String,
    label: 'userId',
  },
  trackingId: {
    type: String,
    label: 'dateAdded',
  },
  dateAdded: {
    type: Date,
    label: 'dateAdded',
  },
});

OrderTrackingId.attachSchema(OrderTrackingIdSchema);

OrderTrackingId.allow({
  insert() {
    return userLoggedIn();
  },
  update() {
    return userLoggedIn();
  },
  remove() {
    return userLoggedIn();
  },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('order.tracking', () => OrderTrackingId.find());
}

Meteor.methods({
  'order.trackingId.insert': function OrderTrackingIdInsert(orderId, trackingId) {
    if (userLoggedIn()) {
      const newOrderTrackingId = {
        orderId,
        trackingId,
        dateAdded: new Date(),
      };

      check(orderId, String);
      check(trackingId, String);
      check(newOrderTrackingId, OrderTrackingIdSchema);
      OrderTrackingId.insert(newOrderTrackingId);
    }
  },
  'order.trackingId.remove': function OrderTrackingIdRemove(id) {
    if (userLoggedIn()) {
      check(id, String);

      OrderTrackingId.remove({ _id: id });
    }
  },
  'order.trackingId.remove.by.orderId': function OrderTrackingIdRemoveByOrderId(orderId) {
    if (userLoggedIn()) {
      check(orderId, String);

      OrderTrackingId.remove({ orderId });
    }
  },
});

export default OrderTrackingId;

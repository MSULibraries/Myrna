import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { Order } from './../order';
import { isMaintainer } from './../../../../lib/roles';

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
  rate: {
    type: String,
    label: 'Cost of the shipment',
  },
  shipmentId: {
    type: String,
    label: 'Id of shipment in shipping API',
  },
  trackingId: {
    type: String,
    label: 'dateAdded',
    optional: true,
  },
  labelImageUrl: {
    type: String,
    label: 'labelImageUrl',
    optional: true,
  },
  trackingUrl: {
    type: String,
    label: 'trackingUrl',
    optional: true,
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
  // Can see all tracking info if maintainer
  Meteor.publish('order.trackingId', () => {
    if (isMaintainer()) {
      return OrderTrackingId.find();
    }
    // User's can only see their own tracking information
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return OrderTrackingId.find({ orderId: { $in: usersOrderIds } });
  });
}

Meteor.methods({
  'order.trackingId.insert': function OrderTrackingIdInsert(orderId, shipmentId, rate) {
    if (userLoggedIn()) {
      const newOrderTrackingId = {
        orderId,
        shipmentId,
        rate,
        dateAdded: new Date(),
      };

      check(orderId, String);
      check(shipmentId, String);
      check(rate, String);
      check(newOrderTrackingId, OrderTrackingIdSchema);
      OrderTrackingId.insert(newOrderTrackingId);
    }
  },
  'order.trackingId.update.tracking': function OrderTrackingIdInsert(
    orderId,
    trackingId,
    labelImageUrl,
    trackingUrl,
  ) {
    if (userLoggedIn()) {
      check(orderId, String);
      check(trackingId, String);
      check(labelImageUrl, String);
      check(trackingUrl, String);

      OrderTrackingId.update(
        { orderId },
        {
          $set: {
            trackingId,
            labelImageUrl,
            trackingUrl,
          },
        },
      );
    }
  },

  /**
   * Returns an order's shipping rate
   * An order must be approved before it has a shipping rate
   * @param {String} orderId
   */
  'order.trackingId.read.rate': function orderTrackingIdReadRate(orderId) {
    if (userLoggedIn()) {
      check(orderId, String);

      const { rate } = OrderTrackingId.findOne({ orderId });
      return rate;
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

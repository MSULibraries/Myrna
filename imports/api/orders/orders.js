import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { EasyPostInterface } from './shipping/index';
import { isMaintainer } from './../../../lib/roles';

import { Addresses } from './../addresses';
import { OrderAddress } from './../orders/orderAddress';

const EasyPost = new EasyPostInterface();

export const Order = new Mongo.Collection('orders');

// Helpers=
Order.helpers({
  address(orderId) {
    const { addressId } = OrderAddress.findOne({ orderId });
    const address = Addresses.findOne({ _id: addressId });
    return address;
  },
});

const orderSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'Users Id',
  },
  dateAdded: {
    type: Date,
    label: 'Date Added',
  },
  dateToArriveBy: {
    type: Date,
    label: 'Date To Arrive By',
  },
  dateToShipBack: {
    type: Date,
    label: 'Date To Ship Back',
  },
  productIds: {
    type: [String],
    label: 'productIds',
  },
  specialInstr: {
    defaultValue: '',
    optional: true,
    type: String,
    label: 'Special Instructions',
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
    if (isMaintainer()) {
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
  }
  return true;
}

function saveTrackingId(orderId = '', trackingId = '', trackingUrl = '', labelImageUrl = '') {
  if (trackingId === '') {
    throw new Error('trackingId is required');
  }

  if (orderId === '') {
    throw new Error('orderId is required');
  }
  if (trackingUrl === '') {
    throw new Error('trackingUrl is required');
  }
  if (labelImageUrl === '') {
    throw new Error('labelImageUrl is required');
  }

  Meteor.call('order.trackingId.insert', orderId, trackingId, trackingUrl, labelImageUrl);
}

async function createShipment(orderId) {
  const {
    company, street1, city, state, zip,
  } = Order.findOne({ _id: orderId }).address(orderId);

  // Creating Shipment
  const fromAddress = await EasyPost.createFromAddress();
  const toAddress = await EasyPost.createToAddress(company, street1, city, state, zip);
  const parcel = await EasyPost.createParcel(9, 6, 2, 10);
  const shipment = await EasyPost.createShipment(fromAddress, toAddress, parcel);
  const { tracking_code: trackingId } = await shipment.buy(shipment.lowestRate(['USPS'], ['First']));
  saveTrackingId(
    orderId,
    trackingId,
    shipment.tracker.public_url,
    shipment.postage_label.label_url,
  );
}

// Methods
Meteor.methods({
  'order.approve': function orderApprove(orderId) {
    if (userLoggedIn()) {
      // Only run on server
      if (!this.isSimulation) {
        createShipment(orderId);
      }
      // Updating order status
      Order.update({ _id: orderId }, { $set: { status: 'Active' } });
    }
  },

  /**
   * Changes the status of an order to cancelled
   * @param {string} orderId - id of the order
   */
  'order.cancel': function orderCancel(orderId) {
    if (userLoggedIn()) {
      check(orderId, String);

      Order.update({ _id: orderId }, { $set: { status: 'Cancelled' } });
    }
  },

  /**
   * Removes an orders entry from the collection and the orders attached addresss
   * @param {string} orderId - id of the order
   */
  'order.delete': function orderDelete(orderId) {
    check(orderId, String);
    if (userLoggedIn()) {
      Order.remove({ _id: orderId });
      Meteor.call('order.address.remove.by.orderId', orderId);
      Meteor.call('order.trackingId.remove.by.orderId', orderId);
    }
  },

  /**
   * Adds a new order to the collection
   * Sets status to 'Un-Approved' by default so that
   * a maintainer can approve the order
   */
  'order.insert': function orderInsert(dateToArriveBy, dateToShipBack, specialInstr = '') {
    if (userLoggedIn()) {
      // Getting all item information from cart
      const cartProductIds = Meteor.call('cart.read.productIds');
      Meteor.call('cart.clear');

      const orderId = Order.insert({
        userId: Meteor.userId(),
        dateAdded: Date.now(),
        dateToArriveBy,
        dateToShipBack,
        productIds: cartProductIds,
        status: 'Un-Approved',
        specialInstr,
      });
      return orderId;
    }
    return undefined;
  },
});

export default Order;

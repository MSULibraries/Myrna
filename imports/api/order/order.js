import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { EasyPostInterface } from './shipping/index';
import { isMaintainer } from './../../../lib/roles';

import { Addresses } from './../addresses';
import { OrderAddress } from './../order/bridges/orderAddress';
import { Payment } from './../../../lib/payment';

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
    allowedValues: ['Active', 'Approved', 'Cancelled', 'Complete', 'Un-Approved'],
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
export function userLoggedIn() {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
  return true;
}

export function savePaymentUrl(orderId = '', paymentUrl = '') {
  if (orderId === '') {
    throw new Error('orderId is required');
  }
  if (paymentUrl === '') {
    throw new Error('paymentUrl is required');
  }

  return Meteor.call('order.payment.insert', orderId, paymentUrl);
}

export function saveTrackingId(
  orderId = '',
  trackingId = '',
  trackingUrl = '',
  labelImageUrl = '',
) {
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

/**
 *
 * @param {String} orderId
 * @param {Number} currentAmountDue
 */
export function createPaymentUrl(orderId, amountDue) {
  const payment = new Payment(Meteor.settings.private.payment.secret);
  const orderNumber = orderId;
  const timestamp = Date.now();

  // Creates URL for a user to go to for payment
  const paymentUrl = payment.createUrl(amountDue, orderNumber, timestamp);

  return paymentUrl;
}

/**
 * Creates a shipment through EasyPost and Buys it
 * @param {String} orderId
 * @returns {Object} shipmentInfo - https://www.easypost.com/docs/api#shipment-object
 */
export async function createShipment(orderId) {
  const {
    company, street1, city, state, zip,
  } = Order.findOne({ _id: orderId }).address(orderId);

  // Creating Shipment
  const fromAddress = await EasyPost.createFromAddress();
  const toAddress = await EasyPost.createToAddress(company, street1, city, state, zip);
  const parcel = await EasyPost.createParcel(9, 6, 2, 10);
  const shipment = await EasyPost.createShipment(fromAddress, toAddress, parcel);
  const shipmentInfo = await shipment.buy(shipment.lowestRate(['USPS'], ['First']));

  saveTrackingId(
    orderId,
    shipmentInfo.tracking_code,
    shipment.tracker.public_url,
    shipment.postage_label.label_url,
  );

  return shipmentInfo;
}

/**
 *  Methods
 */
Meteor.methods({
  'order.approve': function orderApprove(orderId) {
    if (userLoggedIn()) {
      // Updating order status
      Order.update({ _id: orderId }, { $set: { status: 'Approved' } });
    }
  },

  'order.buy': async function orderBuy(orderId) {
    if (userLoggedIn() && !this.isSimulation) {
      // Only run on server
      const mockAmountDue = 50;

      // await createShipment(orderId);

      const paymentUrl = createPaymentUrl(orderId, mockAmountDue);
      savePaymentUrl(orderId, paymentUrl);
      return paymentUrl;
    }
    return undefined;
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
   * Accepts info about an order and tells you if is a legitimate order
   * This is used on payment success page to make sure someone didn't
   * just visit the page to spoof order info
   * @param {String} orderNumber
   * @param {String} timestamp
   * @param {String} userHash
   * @returns {Bool}
   */
  'order.check': function orderCheck(orderNumber, timestamp, userHash) {
    if (!this.isSimulation) {
      const payment = new Payment();
      return payment.validateHash({ orderNumber, timestamp }, userHash);
    }
    return undefined;
  },

  /**
   * Returns the number of orders with optional status
   * @param {Array} orderStatuses
   */
  'order.count': function orderCount(orderStatuses = []) {
    let selector = { userId: Meteor.userId() };

    if (orderStatuses.length > 0) {
      selector = { ...selector, status: { $in: orderStatuses } };
    }

    if (userLoggedIn()) {
      return Order.find(selector).count();
    }
    return 0;
  },

  /**
   * Removes an orders entry from the collection and the orders attached addresss
   * @param {string} orderId - id of the order
   */
  'order.delete': function orderDelete(orderId) {
    check(orderId, String);
    if (userLoggedIn()) {
      Order.remove({ _id: orderId });
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

/**
 * Hooks
 */

// Removing associated documents
Order.before.remove((doc) => {
  Meteor.call('order.address.remove.by.orderId', doc);
  Meteor.call('order.trackingId.remove.by.orderId', doc);
  Meteor.call('order.payment.remove.by.orderId', doc);
});

export default Order;

export const helpers = {
  createPaymentUrl,
};

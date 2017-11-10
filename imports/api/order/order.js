import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { EasyPostInterface } from './shipping/index';
import { isMaintainer } from './../../../lib/roles';

import { Addresses } from './../addresses';
import { OrderAddress } from './../order/bridges/orderAddress';
import { OrderTrackingId } from './../order/bridges/orderTrackingId';
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
  isPickUp: {
    type: Boolean,
    label: 'Order will be picked up',
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

export function saveTrackingId(orderId = '', shipmentId = '', rate = '') {
  if (orderId === '') {
    throw new Error('orderId is required');
  }
  if (shipmentId === '') {
    throw new Error('shipmentId is required');
  }
  if (rate === '') {
    throw new Error('rate is required');
  }

  Meteor.call('order.trackingId.insert', orderId, shipmentId, rate);
}

/**
 *
 * @param {String} orderId
 * @param {Number} currentAmountDue - dollar amount
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
export function createShipment(orderId) {
  return new Promise(async (resolve, reject) => {
    const {
      company, street1, city, state, zip,
    } = Order.findOne({ _id: orderId }).address(orderId);

    // Creating Shipment
    const fromAddress = await EasyPost.createFromAddress();
    const toAddress = await EasyPost.createToAddress(company, street1, city, state, zip);
    const parcel = await EasyPost.createParcel(10, 10, 10, 10);
    const shipment = await EasyPost.createShipment(fromAddress, toAddress, parcel);

    let rate;

    try {
      const { rate: shipmentRate } = shipment.lowestRate(['USPS'], ['First']);
      rate = shipmentRate;
    } catch (error) {
      reject(new Error(`Failed to get shipment rate for order number: ${orderId} with Error: ${error}`));
    }

    saveTrackingId(orderId, shipment.id, rate);

    resolve(shipment);
  });
}

/**
 *  Methods
 */
Meteor.methods({
  'order.activate': function orderActivate(orderId) {
    if (userLoggedIn()) {
      // Updating order status
      Order.update({ _id: orderId }, { $set: { status: 'Active' } }, async (error) => {
        if (!error && !Meteor.isTest) {
          const { shipmentId } = OrderTrackingId.findOne({ orderId });
          const shipment = await EasyPost.buyShipment(shipmentId);

          Meteor.call(
            'order.trackingId.update.tracking',
            orderId,
            shipment.tracker.id,
            shipment.postage_label.label_url,
            shipment.tracker.public_url,
          );
        }
      });
    }
  },
  'order.approve': async function orderApprove(orderId) {
    if (userLoggedIn()) {
      if (!Meteor.isTest) {
        await createShipment(orderId);
      }

      Order.update({ _id: orderId }, { $set: { status: 'Approved' } });
    }
  },

  'order.buy': function orderBuy(orderId) {
    if (userLoggedIn() && !this.isSimulation) {
      // Only run on server
      const clothingCost = 0;

      const shippingCost = Meteor.call('order.trackingId.read.rate', orderId);

      const balanceDue = clothingCost + shippingCost;

      const paymentUrl = createPaymentUrl(orderId, balanceDue);
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
  'order.remove': function orderDelete(orderId) {
    check(orderId, String);
    if (userLoggedIn()) {
      Order.remove({ _id: orderId });
      Meteor.call('order.address.remove.by.orderId', orderId);
      Meteor.call('order.trackingId.remove.by.orderId', orderId);
      Meteor.call('order.payment.remove.by.orderId', orderId);
    }
  },

  /**
   * Adds a new order to the collection
   * Sets status to 'Un-Approved' by default so that
   * a maintainer can approve the order
   */
  'order.insert': function orderInsert(
    dateToArriveBy,
    dateToShipBack,
    isPickUp,
    specialInstr = '',
  ) {
    if (userLoggedIn()) {
      // Getting all item information from cart
      const cartProductIds = Meteor.call('cart.read.productIds');

      const orderId = Order.insert(
        {
          userId: Meteor.userId(),
          dateAdded: Date.now(),
          dateToArriveBy,
          dateToShipBack,
          isPickUp,
          productIds: cartProductIds,
          status: 'Un-Approved',
          specialInstr,
        },
        (error) => {
          if (!error) {
            Meteor.call('cart.clear');
          }
        },
      );
      return orderId;
    }
    return undefined;
  },
});

export default Order;

export const helpers = {
  createPaymentUrl,
};

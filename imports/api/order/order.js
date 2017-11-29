import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { EasyPostInterface } from './shipping/index';
import { isMaintainer } from './../../../lib/roles';

import { Addresses } from './../addresses';
import { OrderAddress } from './../order/bridges/orderAddress';
import { OrderTrackingId } from './../order/bridges/orderTrackingId';
import { Payment } from './../../../lib/payment';
import { setAvailible } from './../ItemDesc/methods/setAvailible/index';
import { removeOrderCost } from './bridges/orderCost/methods/removeOrderCost/index';
import { getOrderCost } from './bridges/orderCost/methods/getOrderCost/index';

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
  status: {
    allowedValues: ['Active', 'Approved', 'Cancelled', 'Complete', 'Delivered', 'Un-Approved'],
    type: String,
    label: 'status',
  },
  dateDelivered: {
    defaultValue: null,
    optional: true,
    type: Date,
    label: 'Date To Ship Back',
  },
  specialInstr: {
    defaultValue: '',
    optional: true,
    type: String,
    label: 'Special Instructions',
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

export function saveTrackingId(orderId, shipmentId, rate) {
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
    const isPickUpOrder = Order.findOne({ _id: orderId }).isPickUp;
    let rate = '0';
    let shipmentId = '';

    if (!isPickUpOrder) {
      const {
        company, street1, city, state, zip,
      } = Order.findOne({ _id: orderId }).address(orderId);

      // Creating Shipment
      const fromAddress = await EasyPost.createFromAddress();
      const toAddress = await EasyPost.createToAddress(company, street1, city, state, zip);
      const parcel = await EasyPost.createParcel(10, 10, 10, 10);
      const shipment = await EasyPost.createShipment(fromAddress, toAddress, parcel);

      try {
        const { rate: shipmentRate } = shipment.lowestRate(['USPS'], ['First']);
        shipmentId = shipment.id;
        rate = shipmentRate;
      } catch (error) {
        reject(new Error(`Failed to get shipment rate for order number: ${orderId} with Error: ${error}`));
      }

      resolve(shipment);
    } else {
      // Pick up orders are automatically set to "Delivered"
      Meteor.call('order.delivered', orderId);
      resolve('Ready For Pick Up');
    }
    saveTrackingId(orderId, shipmentId, rate);
  });
}

/**
 *  Methods
 */
Meteor.methods({
  'order.activate': function orderActivate(orderId) {
    if (userLoggedIn()) {
      const { isPickUp } = Order.findOne({ _id: orderId });
      if (!isPickUp) {
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
      } else {
        Order.update({ _id: orderId }, { $set: { status: 'Delivered' } });
      }
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
      const costumeCost = getOrderCost._execute({ userId: this.userId }, { orderId });
      const shippingCost = Meteor.call('order.trackingId.read.rate', orderId);
      const balanceDue = costumeCost + shippingCost;
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

      const ordersProductIds = Order.findOne({ _id: orderId }).productIds;
      setAvailible.call({ itemIds: ordersProductIds, isAvailible: true });
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
   * Updates the status of an order to 'Delivered'
   */
  'order.delivered': function orderDelivered(orderId) {
    if (!this.isSimulation) {
      Order.update({ _id: orderId }, { $set: { status: 'Delivered', dateDelivered: new Date() } });
    }
  },

  /**
   * Makes an order's product availible, Removes an orders entry from
   * the collection and the orders attached addresss
   * @param {string} orderId - id of the order
   */
  'order.remove': function orderDelete(orderId) {
    check(orderId, String);
    if (userLoggedIn()) {
      // Making order's product availible again
      const ordersProductIds = Order.findOne({ _id: orderId }).productIds;
      setAvailible.call({ itemIds: ordersProductIds, isAvailible: true });

      // Remove order and associated entries
      Order.remove({ _id: orderId });
      Meteor.call('order.address.remove.by.orderId', orderId);
      Meteor.call('order.trackingId.remove.by.orderId', orderId);
      Meteor.call('order.payment.remove.by.orderId', orderId);
      removeOrderCost._execute({ userId: this.userId }, { orderId });
    }
  },

  /**
   * Adds an order's products to a user's cart that has
   * an id of 'orderId'
   * @param {String} - orderId
   */
  'order.reorder': function orderReOrder(orderId) {
    check(orderId, String);

    // Clear Cart
    Meteor.call('cart.clear');

    const { productIds } = Order.findOne({ _id: orderId }, { fields: { productIds: 1 } });
    Meteor.call('cart.insert.productIds', productIds);
  },
});

export default Order;

export const helpers = {
  createPaymentUrl,
};

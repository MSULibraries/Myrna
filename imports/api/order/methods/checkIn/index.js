/**
 * Runs procedure for checking in an order
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { Order } from './../../order';
import { setAvailible } from './../../../ItemDesc/methods/setAvailible/index';

export const checkIn = new ValidatedMethod({
  name: 'order.checkIn ',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'Error in checkIn : You must be logged in to check in an order',
  },
  validate: new SimpleSchema({
    orderId: { type: String },
  }).validator(),

  run({ orderId }) {
    Order.update({ _id: orderId }, { $set: { status: 'Complete' } });
    const ordersProductIds = Order.findOne({ _id: orderId }).productIds;
    // Making items unavailible since they are part of an order now
    setAvailible.call({ itemIds: ordersProductIds, isAvailible: true });
  },
});

export default checkIn;

/**
 * Inserts an orders package dimensions to db
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { OrderParcelDimensions } from './../../index';
import { roles } from './../../../../../../../lib/roles';

export const insertOrderParcelDimensions = new ValidatedMethod({
  name: 'order.orderParcelDimensions.insert',
  mixins: [LoggedInMixin],
  checkRoles: {
    roles: [roles.maintainers],
    rolesError: {
      error: 'not-allowed',
      message: "Only 'maintainers' may insert an order's parcel dimensions",
    },
  },
  checkLoggedInError: {
    error: 'notLogged',
    message:
      'Error in insertOrderParcelDimensions : You must be logged in to submit the cost of an order',
  },
  validate: new SimpleSchema({
    orderId: { type: String },
    height: { type: Number, decimal: true },
    length: { type: Number, decimal: true },
    weight: { type: Number, decimal: true },
    width: { type: Number, decimal: true },
  }).validator(),

  run({
    height, length, weight, width, orderId,
  }) {
    OrderParcelDimensions.insert({
      dateAdded: new Date(),
      height,
      maintainerId: this.userId,
      length,
      orderId,
      weight,
      width,
    });
  },
});

export default insertOrderParcelDimensions;

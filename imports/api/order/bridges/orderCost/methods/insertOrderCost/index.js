/**
 * Attaches a cost to an order
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { round } from 'lodash';
import { OrderCost } from './../../index';
import { roles } from './../../../../../../../lib/roles';

export const insertOrderCost = new ValidatedMethod({
  name: 'order.cost.insert',
  mixins: [LoggedInMixin],
  checkRoles: {
    roles: [roles.maintainers],
    rolesError: {
      error: 'not-allowed',
      message: "Only 'maintainers' may insert an order's cost",
    },
  },
  checkLoggedInError: {
    error: 'notLogged',
    message: 'Error in insertOrderCost : You must be logged in to submit the cost of an order',
  },
  validate: new SimpleSchema({
    orderId: { type: String },
    costumeCost: { type: Number, decimal: true },
  }).validator(),

  run({ costumeCost, orderId }) {
    OrderCost.insert({
      costumeCost: round(costumeCost, 2),
      dateAdded: new Date(),
      maintainerId: this.userId,
      orderId,
    });
  },
});

export default insertOrderCost;

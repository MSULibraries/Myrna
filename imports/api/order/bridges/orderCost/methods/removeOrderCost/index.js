/**
 * Removes the entry for an order's cost
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

import { OrderCost } from './../../index';
import { roles } from './../../../../../../../lib/roles';

export const removeOrderCost = new ValidatedMethod({
  name: 'order.cost.remove',
  checkRoles: {
    roles: [roles.maintainers],
    rolesError: {
      error: 'not-allowed',
      message: "Only 'maintainers' may remove an order's cost",
    },
  },
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message:
      "Error in removeOrderCost : You must be logged in and a 'maintainer' to remove the cost of an order",
  },
  validate: new SimpleSchema({
    orderId: { type: String },
  }).validator(),

  run({ orderId }) {
    OrderCost.remove({
      orderId,
    });
  },
});

export default removeOrderCost;

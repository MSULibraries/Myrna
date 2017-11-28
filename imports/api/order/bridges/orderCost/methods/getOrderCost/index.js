/**
 * Get's a user's orderCost by ID
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { OrderCost } from './../../index';

export const getOrderCost = new ValidatedMethod({
  name: 'order.cost.get',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: 'Error in getOrderCost : You must be logged in to submit the cost of an order',
  },
  validate: new SimpleSchema({
    orderId: { type: String, regEx: SimpleSchema.RegEx.Id },
  }).validator(),

  run({ orderId }) {
    return OrderCost.findOne(
      {
        orderId,
      },
      { fields: { costumeCost: 1 } },
    ).costumeCost;
  },
});

export default getOrderCost;

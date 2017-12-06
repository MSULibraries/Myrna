/**
 * Removes an orders package dimensions to db
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { OrderParcelDimensions } from './../../index';
import { roles } from './../../../../../../../lib/roles';

export const removeOrderParcelDimensions = new ValidatedMethod({
  name: 'order.orderParcelDimensions.remove',
  mixins: [LoggedInMixin],
  checkRoles: {
    roles: [roles.maintainers],
    rolesError: {
      error: 'not-allowed',
      message: "Only 'maintainers' may remove an order's parcel dimensions",
    },
  },
  checkLoggedInError: {
    error: 'notLogged',
    message:
      'Error in removeOrderParcelDimensions : You must be logged in to submit the cost of an order',
  },
  validate: new SimpleSchema({
    orderId: { type: String },
  }).validator(),

  run({ orderId }) {
    OrderParcelDimensions.remove({
      orderId,
    });
  },
});

export default removeOrderParcelDimensions;

/**
 * Adds products from a show into a user's cart
 * @param {Strings}- showId
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { Show } from './../../index';

export const pullShow = new ValidatedMethod({
  /* eslint-disable no-underscore-dangle */
  name: 'show.methods.pullShow',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: "You need to be logged in to call to user 'pullShow'",
  },
  validate: new SimpleSchema({
    showId: { type: String },
  }).validator(),

  run({ showId }) {
    const { productIds } = Show.findOne({ _id: showId }, { fields: { productIds: 1 } });
    Meteor.call('cart.insert.productIds', productIds);
  },
});
export default pullShow;

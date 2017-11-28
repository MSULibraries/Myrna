/**
 * Takes an array of productIds and get's their product info
 * @param {[Strings]}
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { ItemDesc } from './../../index';

export const getProductsInfo = new ValidatedMethod({
  name: 'ItemDesc.methods.getProductsInfo',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: "You need to be logged in to call to user 'getProductsInfo'",
  },
  validate: new SimpleSchema({
    productIds: { type: [String] },
  }).validator(),

  run({ productIds }) {
    return ItemDesc.find({ _id: { $in: productIds } }).fetch();
  },
});
export default getProductsInfo;

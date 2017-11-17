/**
 * Takes an array of productIds and returns object
 * telling if it is availible
 * @param {[Strings]}
 * @returns Object
 *  id is the key and the value is a boolean
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { ItemDesc } from './../../index';

export const getProductAvailibility = new ValidatedMethod({
  /* eslint-disable no-underscore-dangle */
  name: 'ItemDesc.methods.getProductAvailibility',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: "You need to be logged in to call to user 'getProductAvailibility'",
  },
  validate: new SimpleSchema({
    productIds: { type: [String] },
  }).validator(),

  run({ productIds }) {
    const isAvailibleById = {};
    const isAvailible = ItemDesc.find(
      { _id: { $in: productIds } },
      { fields: { isAvailible: 1 } },
    ).fetch();

    isAvailible.forEach((item) => {
      isAvailibleById[item._id] = item.isAvailible;
    });

    return isAvailibleById;
  },
});
export default getProductAvailibility;

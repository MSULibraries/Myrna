/**
 * Sets a items availibility
 * @param {{itemIds: Array, isAvailible: Boolean}}
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { ItemDesc } from './../../index';

export const setAvailible = new ValidatedMethod({
  name: 'ItemDesc.methods.setAvailible',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: "You need to be logged in to call to user 'setAvailible'",
  },
  validate: new SimpleSchema({
    itemIds: { type: [String] },
    isAvailible: { type: Boolean },
  }).validator(),

  run({ itemIds, isAvailible }) {
    ItemDesc.update({ _id: { $in: itemIds } }, { $set: { isAvailible } }, { multi: true });
  },
});
export default setAvailible;

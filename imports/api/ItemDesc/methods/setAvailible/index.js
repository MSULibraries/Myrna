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
    itemId: { type: String },
    isAvailible: { type: Boolean },
  }).validator(),

  run({ itemId, isAvailible }) {
    ItemDesc.update({ _id: itemId }, { isAvailible });
  },
});
export default setAvailible;

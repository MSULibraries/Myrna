/**
 * Creates a new customer
 * @param {Strings}- email
 * @param {Strings}- name
 * @param {Strings}- password
 */

import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';
import { roles } from './../../../../lib/roles';

export const findUserById = new ValidatedMethod({
  /* eslint-disable no-underscore-dangle */
  name: 'user.findUserById',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: "You need to be logged in to call to user 'findUserById'",
  },
  checkRoles: {
    roles: [roles.maintainers],
    rolesError: {
      error: 'not-allowed',
      message: "Only 'maintainers' can find users",
    },
  },
  validate: new SimpleSchema({
    id: { type: SimpleSchema.RegEx.Id },
  }).validator(),

  run({ id }) {
    return Meteor.users.findOne({ _id: id });
  },
});

export default findUserById;

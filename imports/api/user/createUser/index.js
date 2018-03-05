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

export const createUser = new ValidatedMethod({
  /* eslint-disable no-underscore-dangle */
  name: 'user.createUser',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message: "You need to be logged in to call to user 'createUser'",
  },
  checkRoles: {
    roles: [roles.maintainers],
    rolesError: {
      error: 'not-allowed',
      message: "Only 'maintainers' may create new users",
    },
  },
  validate: new SimpleSchema({
    email: { type: String },
    name: { type: String },
    password: { type: String },
  }).validator(),

  run({ email, name, password }) {
    return Accounts.createUser({ email, password, options: { name } });
  },
});
export default createUser;

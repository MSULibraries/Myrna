import { roles } from './../../roles';

/**
 * User's Information
 */
export const users = {
  eve: {
    uid: null,
    email: 'eve@gmail.com',
    name: 'eve',
    password: 'password',
  },
  bob: {
    uid: null,
    email: 'bob@gmail.com',
    name: 'eve',
    password: 'password',
  },
};

/**
 * Creating bob and eve's user accounts and assigning their userId's to the 'users' object
 */
function createUsersAccounts() {
  const eveUserId = Accounts.createUser({ email: users.eve.email, password: users.eve.password });
  const bobUserId = Accounts.createUser({ email: users.bob.email, password: users.bob.password });

  users.eve.uid = eveUserId;
  users.bob.uid = bobUserId;
}

/**
 * Creating 'maintainers' role
 */
function createMaintainerRole() {
  Roles.createRole(roles.maintainers);
}

/**
 * Creates two users accounts
 * 'eve' will have maintainer access
 */
export function createMockUsers() {
  if (Meteor.isTest) {
    // Removing any previous users/roles
    Meteor.roles.remove({});
    Meteor.users.remove({});

    createMaintainerRole();

    createUsersAccounts();

    Roles.addUsersToRoles(users.eve.uid, roles.maintainers);
  }
}

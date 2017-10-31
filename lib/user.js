/**
 * @returns {bool}
 */
export function userLoggedIn() {
  if (!Meteor.userId()) {
    throw new Meteor.Error('not-authorized');
  }
  return true;
}

export default userLoggedIn;

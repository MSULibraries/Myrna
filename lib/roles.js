export const roles = {
  maintainers: 'maintainers', // Maintainers should be able to curate the collection, review orders, and approve new users
};

export const isMaintainer = () => Roles.userIsInRole(Meteor.userId(), roles.maintainers);

export default roles;

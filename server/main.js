import { Meteor } from 'meteor/meteor';

import '../imports/api/cart';
import '../imports/api/dresses';
import '../imports/api/orders';
import '../imports/api/itemDesc';

import roles from './../lib/roles';

Meteor.startup(() => {
  Roles.addUsersToRoles('T6QqPcncdheoJyRxG', [roles.maintainers]);
  // code to run on server at startup
});

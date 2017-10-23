import { Meteor } from 'meteor/meteor';

import '../imports/api/addresses';
import '../imports/api/cart';
import '../imports/api/dresses';
import '../imports/api/orders/orders';
import '../imports/api/orders/orderAddress';
import '../imports/api/orders/orderTrackingId';
import '../imports/api/itemDesc';

import { roles } from './../lib/roles';

Meteor.startup(() => {
  // Adding account 'broabect' to maintainers group for testing
  Roles.addUsersToRoles('T6QqPcncdheoJyRxG', [roles.maintainers]);
  // code to run on server at startup
});

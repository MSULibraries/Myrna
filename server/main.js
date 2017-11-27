import { Meteor } from 'meteor/meteor';

import '../imports/api/addresses';
import '../imports/api/cart';
import '../imports/api/dresses';
import '../imports/api/ItemDesc/index';
import '../imports/api/ItemDesc/methods/getProductAvailibility/index';
import '../imports/api/ItemDesc/methods/getProductsInfo/index';
import '../imports/api/ItemDesc/methods/setAvailible/index';
import '../imports/api/order/order';
import '../imports/api/order/methods/submitOrder/index';
import '../imports/api/order/methods/checkIn/index';
import '../imports/api/order/bridges/orderAddress';
import '../imports/api/order/bridges/orderCost/index';
import '../imports/api/order/bridges/orderCost/methods/insertOrderCost/index';
import '../imports/api/order/bridges/orderCost/methods/removeOrderCost/index';
import '../imports/api/order/bridges/orderPayment';
import '../imports/api/order/bridges/orderShow';
import '../imports/api/order/bridges/orderTrackingId';
import '../imports/api/public/api';
import '../imports/api/show/index';
import '../imports/api/show/methods/pullShow/index';

import { roles } from './../lib/roles';

Meteor.startup(() => {
  // Adding account 'broabect' to maintainers group for testing
  Roles.addUsersToRoles('T6QqPcncdheoJyRxG', [roles.maintainers]);
  // code to run on server at startup
});

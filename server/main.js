import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import '../imports/api/addresses';
import '../imports/api/cart';
import '../imports/api/clothing/dresses/index';
import '../imports/api/ItemDesc/index';
import '../imports/api/ItemDesc/methods/getProductAvailibility/index';
import '../imports/api/ItemDesc/methods/getProductsInfo/index';
import '../imports/api/ItemDesc/methods/setAvailible/index';
import '../imports/api/order/order';
import '../imports/api/order/methods/emails/orderDelivered/index';
import '../imports/api/order/methods/emails/orderApproved/index';
import '../imports/api/order/methods/submitOrder/index';
import '../imports/api/order/methods/checkIn/index';
import '../imports/api/order/bridges/orderAddress';
import '../imports/api/order/bridges/orderCost/index';
import '../imports/api/order/bridges/orderCost/methods/insertOrderCost/index';
import '../imports/api/order/bridges/orderParcelDimensions/methods/insertParcelDimensions/index';
import '../imports/api/order/bridges/orderParcelDimensions/methods/removeParcelDimensions/index';
import '../imports/api/order/bridges/orderCost/methods/removeOrderCost/index';
import '../imports/api/order/bridges/orderPayment';
import '../imports/api/order/bridges/orderShow';
import '../imports/api/order/bridges/orderTrackingId';
import '../imports/api/public/api';
import '../imports/api/show/index';
import '../imports/api/show/methods/pullShow/index';

import { roles } from './../lib/roles';

Meteor.startup(() => {
  let masterUid = Accounts.findUserByEmail(Meteor.settings.private.master.email);
  if (!masterUid) {
    masterUid = Accounts.createUser({
      email: Meteor.settings.private.master.email,
      password: Meteor.settings.private.master.password,
    });
  }

  Roles.addUsersToRoles(masterUid, [roles.maintainers]);
  // code to run on server at startup
});

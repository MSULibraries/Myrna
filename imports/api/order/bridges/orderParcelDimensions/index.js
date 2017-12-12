import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Order } from './../../order';
import { isMaintainer } from './../../../../../lib/roles';

export const OrderParcelDimensions = new Mongo.Collection('order.parcelDimensions');

const orderParcelDimensionsSchema = new SimpleSchema({
  dateAdded: {
    type: Date,
    label: 'Date that a maintainer added a cost to order',
  },
  height: {
    type: Number,
    label: 'Height of the Package in inches',
    decimal: true,
  },
  length: {
    type: Number,
    label: 'Length of the Package in inches',
    decimal: true,
  },
  orderId: {
    type: String,
    label: 'Id of Order',
    regEx: [SimpleSchema.RegEx.Id],
  },
  maintainerId: {
    type: String,
    label: 'Id of maintainer who inserted',
    regEx: [SimpleSchema.RegEx.Id],
  },
  weight: {
    type: Number,
    label: 'Weight of the Package in inches',
    decimal: true,
  },
  width: {
    type: Number,
    label: 'Width of the Package in inches',
    decimal: true,
  },
});

OrderParcelDimensions.attachSchema(orderParcelDimensionsSchema);

OrderParcelDimensions.allow({
  insert() {
    return isMaintainer();
  },
  update() {
    return isMaintainer();
  },
  remove() {
    return isMaintainer();
  },
});

if (Meteor.isServer) {
  Meteor.publish('order.parcelDimensions', () => {
    if (isMaintainer()) {
      return OrderParcelDimensions.find({});
    }
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return OrderParcelDimensions.find({
      orderId: {
        $in: usersOrderIds,
      },
    });
  });
}

export default OrderParcelDimensions;

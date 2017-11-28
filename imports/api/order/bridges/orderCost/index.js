import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Order } from './../../order';
import { isMaintainer } from './../../../../../lib/roles';

export const OrderCost = new Mongo.Collection('order.cost');

const orderCostSchema = new SimpleSchema({
  costumeCost: {
    decimal: true,
    type: Number,
    label: 'Cost of the Costumes',
  },
  dateAdded: {
    type: Date,
    label: 'Date that a maintainer added a cost to order',
  },
  maintainerId: {
    type: String,
    label: 'Id of the maintainer who added cost',
  },
  orderId: {
    type: String,
    label: 'Order Id',
  },
});

OrderCost.attachSchema(orderCostSchema);

OrderCost.allow({
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
  Meteor.publish('order.cost', () => {
    if (isMaintainer()) {
      return OrderCost.find({});
    }
    const usersOrderIds = Order.find({ userId: Meteor.userId() }, { fields: { _id: 1 } })
      .fetch() // Executing Query
      .map(({ _id }) => _id); // returning array of order's ids

    return OrderCost.find({
      orderId: {
        $in: usersOrderIds,
      },
    });
  });
}

export default OrderCost;

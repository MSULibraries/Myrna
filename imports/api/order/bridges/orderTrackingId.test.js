/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { OrderTrackingId } from './orderTrackingId';

if (Meteor.isServer) {
  describe('OrderTrackingId', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const orderId = Random.id();
      const rate = '3.50';
      const shipmentId = Random.id();
      const trackingId = Random.id();
      const trackingUrl = 'www.google.com';
      const labelImageUrl = 'www.google.com';

      let mockOrderTrackingId;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Order collection
        OrderTrackingId.remove({});

        // Inserting a Order Address item (Default Status)
        mockOrderTrackingId = OrderTrackingId.insert({
          orderId,
          rate,
          isPickUp: false,
          shipmentId,
          trackingId,
          trackingUrl,
          labelImageUrl,
          dateAdded: new Date(),
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('orders.trackingId.remove removes entry from collection', () => {
        const removeOrderTrackingId = Meteor.server.method_handlers['order.trackingId.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        removeOrderTrackingId.apply(invocation, [mockOrderTrackingId]);
        assert.equal(OrderTrackingId.find().count(), 0);
      });

      it('orders.trackingId.read.rate returns the shipping rate for a package', () => {
        const readRate = Meteor.server.method_handlers['order.trackingId.read.rate'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Making sure it returns the number and not the string for the price
        const expectedRate = +rate;
        const actualRate = readRate.apply(invocation, [orderId]);
        assert.equal(actualRate, expectedRate);
      });

      it('orders.trackingId.remove.by.orderId removes entry from collection by orderId', () => {
        const removeOrderTrackingIdByOrderId =
          Meteor.server.method_handlers['order.trackingId.remove.by.orderId'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        removeOrderTrackingIdByOrderId.apply(invocation, [orderId]);
        assert.equal(OrderTrackingId.find().count(), 0);
      });

      it('orders.trackingId.insert inserts', () => {
        const insertOrderTrackingId = Meteor.server.method_handlers['order.trackingId.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertOrderTrackingId.apply(invocation, [false, Random.id(), Random.id(), '3.50']);
        assert.equal(OrderTrackingId.find().count(), 2);
      });
    });
  });
}

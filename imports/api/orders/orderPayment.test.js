/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { OrderPayment } from './orderPayment';

if (Meteor.isServer) {
  describe('OrderPayment', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const orderId = Random.id();
      const paymentUrl = 'www.freePaymentAPI.com';
      let mockOrderPaymentId;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Order collection
        OrderPayment.remove({});

        // Inserting a Order Address item (Default Status)
        mockOrderPaymentId = OrderPayment.insert({
          orderId,
          paymentUrl,
          dateAdded: new Date(),
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('orders.payment.insert inserts', () => {
        const insertOrderPayment = Meteor.server.method_handlers['order.payment.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertOrderPayment.apply(invocation, ['1', 'www.payForFree.com']);
        assert.equal(OrderPayment.find().count(), 2);
      });

      it('orders.payment.remove removes order from collection', () => {
        const removeOrderPayment = Meteor.server.method_handlers['order.payment.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        removeOrderPayment.apply(invocation, [mockOrderPaymentId]);
        assert.equal(OrderPayment.find().count(), 0);
      });

      it('orders.payment.remove.by.orderId removes entry from collection by orderId', () => {
        const removeOrderPaymentByOrderId =
          Meteor.server.method_handlers['order.payment.remove.by.orderId'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        removeOrderPaymentByOrderId.apply(invocation, [orderId]);
        assert.equal(OrderPayment.find().count(), 0);
      });
    });
  });
}

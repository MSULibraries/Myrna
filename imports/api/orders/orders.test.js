/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import * as OrderApi from './orders';
import { Payment } from './../../../lib/payment';

if (Meteor.isServer) {
  describe('Order', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const mockCartProductIds = [Random.id(), Random.id(), Random.id()];
      let mockOrderId;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Order collection
        OrderApi.Order.remove({});

        // Inserting a Order item (Default Status)
        mockOrderId = OrderApi.Order.insert({
          userId: Meteor.userId(),
          dateAdded: Date.now(),
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          productIds: mockCartProductIds,
          specialInstr: 'None',
          status: 'Un-Approved',
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it("order.approve updates order status to 'Active'", () => {
        const activateOrder = Meteor.server.method_handlers['order.approve'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };
        const expectedStatus = 'Active';

        activateOrder.apply(invocation, [mockOrderId]);
        assert.equal(OrderApi.Order.findOne({ _id: mockOrderId }).status, expectedStatus);
      });

      it("order.cancel updates order status to 'Cancelled'", () => {
        const cancelOrder = Meteor.server.method_handlers['order.cancel'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };
        const expectedStatus = 'Cancelled';
        cancelOrder.apply(invocation, [mockOrderId]);

        assert.equal(OrderApi.Order.findOne({ _id: mockOrderId }).status, expectedStatus);
      });

      it('order.delete removes order from collection', () => {
        const readOrder = Meteor.server.method_handlers['order.delete'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        readOrder.apply(invocation, [mockOrderId]);
        assert.equal(OrderApi.Order.find().count(), 0);
      });

      it('order.insert inserts', () => {
        const insertOrder = Meteor.server.method_handlers['order.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Inserting expects a dateToArriveBy, dateToShipBack, and special instr
        insertOrder.apply(invocation, [new Date(), new Date(), 'Send pizza with order']);
        assert.equal(OrderApi.Order.find().count(), 2);
      });
    });

    describe('helpers', () => {
      describe('createPaymentUrl', () => {
        let createUrlStub;

        beforeEach(() => {
          createUrlStub = sinon.spy(Payment.prototype, 'createUrl');
        });

        afterEach(() => {
          Payment.prototype.createUrl.restore();
        });

        it('calls payment.createUrl', () => {
          const orderId = Random.id();
          OrderApi.createPaymentUrl(orderId, 50);
          sinon.assert.calledOnce(createUrlStub);
        });
      });
    });
  });
}

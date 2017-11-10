/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import * as OrderApi from './order';
import { Payment } from './../../../lib/payment';

if (Meteor.isServer) {
  describe('Order', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const mockCartProductIds = [Random.id(), Random.id(), Random.id()];
      let mockOrderId;
      let totalOrders;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');
        totalOrders = 5;
        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Order collection
        OrderApi.Order.remove({});

        /**
         * Inserting Orders
         */
        // 'Active' status
        mockOrderId = OrderApi.Order.insert({
          userId: Meteor.userId(),
          isPickUp: false,
          dateAdded: Date.now(),
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          productIds: mockCartProductIds,
          specialInstr: 'None',
          status: 'Active',
        });
        // 'Approved' status
        OrderApi.Order.insert({
          userId: Meteor.userId(),
          isPickUp: false,
          dateAdded: Date.now(),
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          productIds: mockCartProductIds,
          specialInstr: 'None',
          status: 'Approved',
        });
        // 'Cancelled' status
        OrderApi.Order.insert({
          userId: Meteor.userId(),
          isPickUp: false,
          dateAdded: Date.now(),
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          productIds: mockCartProductIds,
          specialInstr: 'None',
          status: 'Cancelled',
        });
        // 'Complete' status
        OrderApi.Order.insert({
          userId: Meteor.userId(),
          isPickUp: false,
          dateAdded: Date.now(),
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          productIds: mockCartProductIds,
          specialInstr: 'None',
          status: 'Complete',
        });
        // 'Un-Approved'
        OrderApi.Order.insert({
          userId: Meteor.userId(),
          isPickUp: false,
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

      describe('order.activate', () => {
        it("updates status to 'Active'", () => {
          const activateOrder = Meteor.server.method_handlers['order.activate'];
          // Set up a fake method invocation that looks like what the method expects
          const invocation = { userId };
          const expectedStatus = 'Active';

          activateOrder.apply(invocation, [mockOrderId]);
          assert.equal(OrderApi.Order.findOne({ _id: mockOrderId }).status, expectedStatus);
        });
      });

      describe('order.buy', () => {
        let getRateStub;
        beforeEach(() => {
          getRateStub = sinon.stub(Meteor, 'call');
        });

        afterEach(() => {
          Meteor.call.restore();
        });

        it('gets rate for package', () => {
          const buyOrder = Meteor.server.method_handlers['order.buy'];
          const invocation = { userId };
          getRateStub.withArgs('order.trackingId.read.rate').returns(50);
          buyOrder.apply(invocation, [mockOrderId]);

          sinon.assert.calledOnce(getRateStub.withArgs('order.trackingId.read.rate'));
        });
      });

      it("order.approve updates order status to 'Approved'", async () => {
        const approveOrder = Meteor.server.method_handlers['order.approve'];
        const invocation = { userId };
        const expectedStatus = 'Approved';

        await approveOrder.apply(invocation, [mockOrderId]);
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
      describe('order.count', () => {
        it('returns the number of orders a user has regardless of order status', () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          // Set up a fake method invocation that looks like what the method expects
          const invocation = { userId };

          // Inserted 3 different orders in the beforeEach
          const actualCount = orderCount.apply(invocation, []);

          assert.equal(actualCount, totalOrders);
        });
        it("returns the number of  'Active' orders", () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          const invocation = { userId };
          const targetStatus = 'Active';
          const expectedCount = 1;
          const actualCount = orderCount.apply(invocation, [[targetStatus]]);

          assert.equal(actualCount, expectedCount);
        });
        it("returns the number of  'Approved' orders", () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          const invocation = { userId };
          const targetStatus = 'Approved';
          const expectedCount = 1;
          const actualCount = orderCount.apply(invocation, [[targetStatus]]);

          assert.equal(actualCount, expectedCount);
        });
        it("returns the number of  'Cancelled' orders", () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          const invocation = { userId };
          const targetStatus = 'Cancelled';
          const expectedCount = 1;
          const actualCount = orderCount.apply(invocation, [[targetStatus]]);

          assert.equal(actualCount, expectedCount);
        });
        it("returns the number of  'Complete' orders", () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          const invocation = { userId };
          const targetStatus = 'Complete';
          const expectedCount = 1;
          const actualCount = orderCount.apply(invocation, [[targetStatus]]);

          assert.equal(actualCount, expectedCount);
        });
        it("returns the number of  'Un-Approved' orders", () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          const invocation = { userId };
          const targetStatus = 'Un-Approved';
          const expectedCount = 1;
          const actualCount = orderCount.apply(invocation, [[targetStatus]]);

          assert.equal(actualCount, expectedCount);
        });
        it('returns the number orders with more than one status', () => {
          const orderCount = Meteor.server.method_handlers['order.count'];
          const invocation = { userId };
          const targetStatuses = ['Un-Approved', 'Approved'];
          const expectedCount = targetStatuses.length;
          const actualCount = orderCount.apply(invocation, [targetStatuses]);

          assert.equal(actualCount, expectedCount);
        });
      });

      it('order.remove removes order from collection', () => {
        const readOrder = Meteor.server.method_handlers['order.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        readOrder.apply(invocation, [mockOrderId]);
        assert.equal(OrderApi.Order.find().count(), totalOrders - 1);
      });

      it('order.insert inserts', () => {
        const insertOrder = Meteor.server.method_handlers['order.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        // Inserting expects a dateToArriveBy, dateToShipBack, isPickUp and special instr
        insertOrder.apply(invocation, [new Date(), new Date(), false, 'Send pizza with order']);

        assert.equal(OrderApi.Order.find().count(), totalOrders + 1);
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

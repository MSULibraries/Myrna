/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { OrderAddress } from './orderAddress';

if (Meteor.isServer) {
  describe('OrderAddress', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const orderId = Random.id();
      const addressId = Random.id();
      let mockOrderAddressId;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Order collection
        OrderAddress.remove({});

        // Inserting a Order Address item (Default Status)
        mockOrderAddressId = OrderAddress.insert({
          orderId,
          addressId,
          dateAdded: new Date(),
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('orders.addresses.delete removes order from collection', () => {
        const insertOrderAddress = Meteor.server.method_handlers['order.address.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertOrderAddress.apply(invocation, [mockOrderAddressId]);
        assert.equal(OrderAddress.find().count(), 0);
      });

      it('orders.addresses.insert inserts', () => {
        const insertOrderAddress = Meteor.server.method_handlers['order.address.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertOrderAddress.apply(invocation, ['1', '2']);
        assert.equal(OrderAddress.find().count(), 2);
      });
    });
  });
}

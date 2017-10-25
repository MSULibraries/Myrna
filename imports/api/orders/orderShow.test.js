/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { OrderShow } from './orderShow';

if (Meteor.isServer) {
  describe('OrderShow', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const orderId = Random.id();
      const showId = Random.id();

      let mockOrderShowId;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Order collection
        OrderShow.remove({});

        // Inserting a Order Address item (Default Status)
        mockOrderShowId = OrderShow.insert({
          orderId,
          showId,
          dateAdded: new Date(),
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('orders.showId.remove removes entry from collection', () => {
        const removeOrderShow = Meteor.server.method_handlers['order.show.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        removeOrderShow.apply(invocation, [mockOrderShowId]);
        assert.equal(OrderShow.find().count(), 0);
      });

      it('orders.showId.insert inserts', () => {
        const insertOrderShow = Meteor.server.method_handlers['order.show.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertOrderShow.apply(invocation, ['1', '2']);
        assert.equal(OrderShow.find().count(), 2);
      });
    });
  });
}

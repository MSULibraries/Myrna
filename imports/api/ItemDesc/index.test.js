/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { ItemDesc } from './index';

if (Meteor.isServer) {
  describe('ItemDesc', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      let mockItemDescId;

      const oldId = 'asdf';
      const name = 'asdf';
      const description = 'asdf';
      const costPerTimeframe = 'asdf';
      const maxTimeframe = 'asdf';
      const timeframe = 'asdf';
      const category = 'asdf';
      const isAvailible = true;
      const minimumTimeframe = 'asdf';
      const shippingRate = 'asdf';
      const expectedReturn = 'asdf';
      const uniqueIdentifier = 'asdf';
      const itemStatus = 'asdf';
      const shortDescription = 'asdf';
      const discr = 'asdf';
      const baseCost = 'asdf';

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing ItemDesc collection
        ItemDesc.remove({});

        mockItemDescId = ItemDesc.insert({
          oldId,
          name,
          description,
          isAvailible,
          costPerTimeframe,
          maxTimeframe,
          timeframe,
          category,
          minimumTimeframe,
          shippingRate,
          expectedReturn,
          uniqueIdentifier,
          itemStatus,
          shortDescription,
          discr,
          baseCost,
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('itemDesc.insert inserts', () => {
        const instertDesc = Meteor.server.method_handlers['itemDesc.insert'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        instertDesc.apply(invocation, [
          oldId,
          name,
          description,
          costPerTimeframe,
          maxTimeframe,
          timeframe,
          isAvailible,
          category,
          minimumTimeframe,
          shippingRate,
          expectedReturn,
          uniqueIdentifier,
          itemStatus,
          shortDescription,
          discr,
          baseCost,
        ]);

        assert.equal(ItemDesc.find().count(), 2);
      });
      it('itemDesc.delete deletes', () => {
        const itemDescRemove = Meteor.server.method_handlers['itemDesc.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        itemDescRemove.apply(invocation, [mockItemDescId]);
        assert.equal(ItemDesc.find().count(), 0);
      });
    });
  });
}

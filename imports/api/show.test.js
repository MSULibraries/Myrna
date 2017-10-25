/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { Show } from './show';

if (Meteor.isServer) {
  describe('Shows', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const productIds = [Random.id(), Random.id(), Random.id()];
      const ownerId = Random.id();
      const createdAt = new Date();
      const name = 'RICKKKK';
      let mockShowId;
      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Show collection
        Show.remove({});

        mockShowId = Show.insert({
          name,
          productIds,
          createdAt,
          ownerId,
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('show.insert inserts', () => {
        const insertDress = Meteor.server.method_handlers['show.insert'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertDress.apply(invocation, [
          'The Wizard of Oz 2017', // Name of Show
          ['1', '2', '3', '4', '5'], // Product Ids for the show
        ]);

        assert.equal(Show.find().count(), 2);
      });
      it('show.delete deletes', () => {
        const showRemove = Meteor.server.method_handlers['show.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        showRemove.apply(invocation, [mockShowId]);
        assert.equal(Show.find().count(), 0);
      });
    });
  });
}

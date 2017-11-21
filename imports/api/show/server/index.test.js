/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert, expect } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { Show } from './../index';

if (Meteor.isServer) {
  describe('Shows', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const productIds = [Random.id(), Random.id(), Random.id()];
      const ownerId = Random.id();
      const createdAt = new Date();
      const name = 'RICKKKK';
      let mockShow;
      let mockShowId;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Show collection
        Show.remove({});

        mockShow = {
          name,
          productIds,
          createdAt,
          ownerId,
        };

        mockShowId = Show.insert(mockShow);
        mockShow = { _id: mockShowId, ...mockShow };
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('show.insert inserts', () => {
        const insertShow = Meteor.server.method_handlers['show.insert'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertShow.apply(invocation, [
          'The Wizard of Oz 2017', // Name of Show
          ['1', '2', '3', '4', '5'], // Product Ids for the show
        ]);

        assert.equal(Show.find().count(), 2);
      });

      it('show.read reads', () => {
        const readShow = Meteor.server.method_handlers['show.read'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        const actualShow = readShow.apply(invocation, [mockShowId]);

        expect(actualShow).to.be.deep.equal(mockShow);
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

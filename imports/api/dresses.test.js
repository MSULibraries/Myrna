/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { Dresses } from './dresses';

if (Meteor.isServer) {
  describe('Dresses', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      let mockDressId;

      // Mock dress data
      const arms = 1;
      const bust = 1;
      const collar = 1;
      const hips = 1;
      const insideSleeve = 1;
      const length = 1;
      const neckToEndOfTrain = 1;
      const neckToHem = 1;
      const oneSizeFitsMost = true;
      const skirtLength = 1;
      const shoulders = 1;
      const shoulderToHem = 1;
      const waist = 1;
      const waistToHem = 1;

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Dresses collection
        Dresses.remove({});

        mockDressId = Dresses.insert({
          arms,
          bust,
          collar,
          createdAt: new Date(),
          hips,
          insideSleeve,
          length,
          neckToEndOfTrain,
          neckToHem,
          oneSizeFitsMost,
          owner: Meteor.userId(),
          skirtLength,
          shoulders,
          shoulderToHem,
          waist,
          waistToHem,
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('dresses.insert inserts', () => {
        const insertDress = Meteor.server.method_handlers['dresses.insert'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertDress.apply(invocation, [
          arms,
          bust,
          collar,
          hips,
          insideSleeve,
          length,
          neckToEndOfTrain,
          neckToHem,
          oneSizeFitsMost,
          skirtLength,
          shoulders,
          shoulderToHem,
          waist,
          waistToHem,
        ]);

        assert.equal(Dresses.find().count(), 2);
      });
      it('dresses.delete deletes', () => {
        const removeDress = Meteor.server.method_handlers['dresses.remove'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        removeDress.apply(invocation, [mockDressId]);
        assert.equal(Dresses.find().count(), 0);
      });
    });
  });
}

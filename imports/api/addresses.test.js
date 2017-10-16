/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { Addresses } from './addresses';

if (Meteor.isServer) {
  describe('Addresses', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      let mockAddressId;

      // Mock dress data
      const name = 'Bill';
      const company = 'Bill Co';
      const street1 = 'Bill St';
      const city = 'Billpulo';
      const state = 'Mississippi';
      const zip = '33335';

      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing Dresses collection
        Addresses.remove({});

        mockAddressId = Addresses.insert({
          city,
          createdAt: new Date(),
          company,
          name,
          owner: Meteor.userId(),
          street1,
          state,
          zip,
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('addresses.insert inserts', () => {
        const insertAddress = Meteor.server.method_handlers['addresses.insert'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertAddress.apply(invocation, [name, company, street1, city, state, zip]);

        assert.equal(Addresses.find().count(), 2);
      });
      it('addresses.delete deletes', () => {
        const removeAddress = Meteor.server.method_handlers['addresses.remove'];
        const invocation = { userId };

        removeAddress.apply(invocation, [mockAddressId]);
        assert.equal(Addresses.find().count(), 0);
      });
    });
  });
}

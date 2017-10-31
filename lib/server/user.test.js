/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import * as helper from './../user';

describe('lib/user', () => {
  let userId;
  let userIdStub;
  describe('logged in', () => {
    beforeEach(() => {
      userId = Random.id();
      userIdStub = sinon.stub(Meteor, 'userId');
      userIdStub.returns(userId);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    it('returns true ', () => {
      helper.userLoggedIn();
      assert.equal(helper.userLoggedIn(), true);
    });
  });
  describe('logged out', () => {
    beforeEach(() => {
      userId = undefined;
      userIdStub = sinon.stub(Meteor, 'userId');
      userIdStub.returns(userId);
    });

    afterEach(() => {
      Meteor.userId.restore();
    });

    it('throws error', () => {
      assert.throws(() => helper.userLoggedIn(), Meteor.Error, 'not-authorized');
    });
  });
});

/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { pullShow } from './../index';
import { Show } from './../../../index';
import { Cart } from './../../../../cart';

describe('Show', () => {
  describe('methods', () => {
    describe('pullShow()', () => {
      let mockShowId;
      const ownerId = Random.id();
      const newMockShow = {
        createdAt: new Date(),
        name: 'Gr8 Show',
        ownerId,
        productIds: [Random.id(), Random.id(), Random.id()],
      };

      beforeEach(() => {
        Show.remove({});
        Cart.remove({});
        mockShowId = Show.insert(newMockShow);
        sinon.stub(Meteor, 'userId').returns(1);
      });

      afterEach(() => {
        Meteor.userId.restore();
      });

      it("adds a show's products to cart", () => {
        pullShow._execute({ userId: 1 }, { showId: mockShowId });
        const expectedProductIds = newMockShow.productIds;

        const cart = Cart.find({}).fetch();
        const cartItemIds = cart.map(p => p.productId);

        assert.deepEqual(cartItemIds, expectedProductIds);
      });
    });
  });
});

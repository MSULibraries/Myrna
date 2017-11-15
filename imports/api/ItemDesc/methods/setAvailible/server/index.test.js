/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';

import { ItemDesc } from './../../../index';
import { setAvailible } from './../index';

describe('ItemDesc', () => {
  describe('methods', () => {
    describe('setAvailible()', () => {
      let mockItemDescId;
      const newItemDesc = {
        oldId: 'asdf',
        name: 'asdf',
        description: 'asdf',
        costPerTimeframe: 'asdf',
        maxTimeframe: 'asdf',
        isAvailible: true,
        timeframe: 'asdf',
        category: 'asdf',
        minimumTimeframe: 'asdf',
        shippingRate: 'asdf',
        expectedReturn: 'asdf',
        uniqueIdentifier: 'asdf',
        itemStatus: 'asdf',
        shortDescription: 'asdf',
        discr: 'asdf',
        baseCost: 'asdf',
      };
      beforeEach(() => {
        ItemDesc.remove({});

        mockItemDescId = ItemDesc.insert(newItemDesc);
      });

      it("sets 'isAvailible' to 'false'", () => {
        setAvailible._execute({ userId: 1 }, { itemIds: [mockItemDescId], isAvailible: false });

        assert.equal(ItemDesc.findOne({ _id: mockItemDescId }).isAvailible, false);
      });

      it("sets 'isAvailible' to 'true'", () => {
        setAvailible._execute({ userId: 1 }, { itemIds: [mockItemDescId], isAvailible: true });

        assert.equal(ItemDesc.findOne({ _id: mockItemDescId }).isAvailible, true);
      });
    });
  });
});

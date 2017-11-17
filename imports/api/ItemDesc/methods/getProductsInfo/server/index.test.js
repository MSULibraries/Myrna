/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';

import { ItemDesc } from './../../../index';
import { getProductsInfo } from './../index';

describe('ItemDesc', () => {
  describe('methods', () => {
    describe('getProductsInfo()', () => {
      let mockItemDescId1;
      let mockItemDescId2;
      const newItemDesc1 = {
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
      const newItemDesc2 = {
        oldId: ';lkj',
        name: ';lkj',
        description: ';lkj',
        costPerTimeframe: ';lkj',
        maxTimeframe: ';lkj',
        isAvailible: false,
        timeframe: ';lkj',
        category: ';lkj',
        minimumTimeframe: ';lkj',
        shippingRate: ';lkj',
        expectedReturn: ';lkj',
        uniqueIdentifier: ';lkj',
        itemStatus: ';lkj',
        shortDescription: ';lkj',
        discr: ';lkj',
        baseCost: ';lkj',
      };

      beforeEach(() => {
        ItemDesc.remove({});

        mockItemDescId1 = ItemDesc.insert(newItemDesc1);
        mockItemDescId2 = ItemDesc.insert(newItemDesc2);
      });

      it('returns a single products info', () => {
        getProductsInfo._execute({ userId: 1 }, { productIds: [mockItemDescId1] });

        assert.deepEqual(ItemDesc.findOne({ _id: mockItemDescId1 }), {
          _id: mockItemDescId1,
          ...newItemDesc1,
        });
      });

      it('returns a multi products info', () => {
        getProductsInfo._execute({ userId: 1 }, { productIds: [mockItemDescId1, mockItemDescId2] });

        assert.deepEqual(ItemDesc.findOne({ _id: mockItemDescId1 }), {
          _id: mockItemDescId1,
          ...newItemDesc1,
        });
        assert.deepEqual(ItemDesc.findOne({ _id: mockItemDescId2 }), {
          _id: mockItemDescId2,
          ...newItemDesc2,
        });
      });
    });
  });
});

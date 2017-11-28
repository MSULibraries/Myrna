/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';

import { ItemDesc } from './../../../index';
import { getProductAvailibility } from './../index';

describe('ItemDesc', () => {
  describe('methods', () => {
    describe('getProductAvailibility()', () => {
      let mockTrueId;
      let mockFalseId;
      const isAvailibleTrue = {
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
      const isAvailibleFalse = {
        oldId: 'asdf',
        name: 'asdf',
        description: 'asdf',
        costPerTimeframe: 'asdf',
        maxTimeframe: 'asdf',
        isAvailible: false,
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

        mockTrueId = ItemDesc.insert(isAvailibleTrue);
        mockFalseId = ItemDesc.insert(isAvailibleFalse);
      });

      it('returns correct values for respective ids', () => {
        getProductAvailibility._execute(
          { userId: 1 },
          { productIds: [mockFalseId, mockTrueId] },
          (error, isAvailible) => {
            assert.isTrue(isAvailible[mockTrueId]);
            assert.isFalse(isAvailible[mockFalseId]);
          },
        );
      });
    });
  });
});

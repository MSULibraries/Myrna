/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';

import getOrderCost from './../index';
import { OrderCost } from './../../../index';
import {
  users,
  createMockUsers,
} from './../../../../../../../../lib/server/testUtil/createMockRoles';

describe('Order', () => {
  describe('methods', () => {
    const costumeCost = 90.91;
    const orderId = Random.id();
    console.log(orderId);
    function removeAllOrderCost() {
      OrderCost.remove({});
    }

    function createMockOrderCost() {
      OrderCost.insert({
        costumeCost,
        dateAdded: new Date(),
        maintainerId: users.eve.uid,
        orderId,
      });
    }

    beforeEach(() => {
      removeAllOrderCost();
      createMockUsers();
      createMockOrderCost();
    });

    it("returns an order's cost", () => {
      const actualCostumeCost = getOrderCost._execute({ userId: Random.id() }, { orderId });

      assert.equal(actualCostumeCost, costumeCost);
    });
    it('throws error if someone is not logged in ', () => {
      assert.throws(() => getOrderCost._execute({ userId: null }, { orderId }));
    });
  });
});

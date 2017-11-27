/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';

import { insertOrderCost } from '../index';
import { OrderCost } from './../../../index';
import {
  users,
  createMockUsers,
} from './../../../../../../../../lib/server/testUtil/createMockRoles';

describe('Order', () => {
  describe('methods', () => {
    function removeAllOrderCost() {
      OrderCost.remove({});
    }

    beforeEach(() => {
      removeAllOrderCost();
      createMockUsers();
    });

    it('inserts an order Cost for a maintainer', () => {
      insertOrderCost._execute({ userId: users.eve.uid }, { orderId: '1', costumeCost: 1 });

      const costCount = OrderCost.find({}).fetch().length;

      assert.equal(costCount, 1);
    });
    it("throws error if someone is not a 'maintainer'", () => {
      assert.throws(() =>
        insertOrderCost._execute({ userId: users.bob.uid }, { orderId: '1', costumeCost: 1 }));
    });
  });
});

/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';

import { removeOrderCost } from '../index';
import { OrderCost } from './../../../index';
import {
  users,
  createMockUsers,
} from './../../../../../../../../lib/server/testUtil/createMockRoles';

describe('Order', () => {
  describe('methods', () => {
    let mockOrder;

    function removeAllOrderCost() {
      OrderCost.remove({});
    }

    beforeEach(() => {
      removeAllOrderCost();
      createMockUsers();

      mockOrder = {
        costumeCost: 0,
        dateAdded: new Date(),
        maintainerId: users.eve.uid,
        orderId: '1',
      };

      OrderCost.insert(mockOrder);
    });

    it('removes an orderCost for a maintainer', () => {
      removeOrderCost._execute({ userId: users.eve.uid }, { orderId: mockOrder.orderId });

      const costCount = OrderCost.find({}).fetch().length;

      assert.equal(costCount, 0);
    });
    it("throws error if someone is not a 'maintainer'", () => {
      assert.throws(() =>
        removeOrderCost._execute({ userId: users.bob.uid }, { orderId: '1', costumeCost: 1 }));
    });
  });
});

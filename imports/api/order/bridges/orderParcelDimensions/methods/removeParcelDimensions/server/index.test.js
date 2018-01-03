/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';

import { removeParcelDimensions } from '../index';
import { OrderParcelDimensions } from './../../../index';
import {
  users,
  createMockUsers,
} from './../../../../../../../../lib/server/testUtil/createMockRoles';

describe('OrderParcelDimensions', () => {
  describe('methods', () => {
    const orderId = Random.id();
    beforeEach(() => {
      OrderParcelDimensions.remove({});

      const height = 5.3;
      const length = 5.3;
      const weight = 5.3;
      const width = 5.3;

      OrderParcelDimensions.insert({
        orderId,
        dateAdded: new Date(),
        maintainerId: users.eve.uid,
        height,
        length,
        weight,
        width,
      });

      createMockUsers();
    });

    it('removes an orderCost for a maintainer', () => {
      removeParcelDimensions._execute(
        { userId: users.eve.uid },
        {
          orderId,
        },
      );
      const count = OrderParcelDimensions.find({}).fetch().length;

      assert.equal(count, 0);
    });
    it("throws error if someone is not a 'maintainer'", () => {
      assert.throws(() =>
        removeParcelDimensions._execute(
          { userId: users.bob.uid },
          {
            orderId,
          },
        ));
    });
  });
});

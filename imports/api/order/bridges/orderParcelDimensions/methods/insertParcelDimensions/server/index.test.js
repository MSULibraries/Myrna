/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import { Random } from 'meteor/random';

import { insertOrderParcelDimensions } from '../index';
import { OrderParcelDimensions } from './../../../index';
import {
  users,
  createMockUsers,
} from './../../../../../../../../lib/server/testUtil/createMockRoles';

describe('OrderParcelDimensions', () => {
  describe('methods', () => {
    beforeEach(() => {
      OrderParcelDimensions.remove({});
      createMockUsers();
    });

    const height = 5.3;
    const length = 5.3;
    const weight = 5.3;
    const width = 5.3;
    it('inserts an orderCost for a maintainer', () => {
      insertOrderParcelDimensions._execute(
        { userId: users.eve.uid },
        {
          orderId: Random.id(),
          height,
          length,
          weight,
          width,
        },
      );
      const count = OrderParcelDimensions.find({}).fetch().length;

      assert.equal(count, 1);
    });
    it("throws error if someone is not a 'maintainer'", () => {
      assert.throws(() =>
        insertOrderParcelDimensions._execute(
          { userId: users.bob.uid },
          {
            orderId: Random.id(),
            height,
            length,
            weight,
            width,
          },
        ));
    });
  });
});

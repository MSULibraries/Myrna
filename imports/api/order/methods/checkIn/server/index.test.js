/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { Order } from './../../../order';
import { checkIn } from './../index';
import { setAvailible } from './../../../../ItemDesc/methods/setAvailible/index';

describe('Order', () => {
  describe('methods', () => {
    describe('checkIn()', () => {
      let mockOrderId;
      let setAvailibleStub;
      const newMockOrder = {
        userId: '1',
        dateAdded: new Date(),
        dateToArriveBy: new Date(),
        dateToShipBack: new Date(),
        isPickUp: false,
        productIds: ['abc', '123'],
        status: 'Un-Approved',
        specialInstr: '',
      };

      beforeEach(() => {
        Order.remove({});
        mockOrderId = Order.insert(newMockOrder);

        setAvailibleStub = sinon.stub(setAvailible, 'call');
      });

      afterEach(() => {
        setAvailible.call.restore();
      });

      it("updates an order's status to 'Complete", () => {
        checkIn._execute({ userId: 1 }, { orderId: mockOrderId });

        const { status } = Order.findOne({ _id: mockOrderId });
        const expectedStatus = 'Complete';

        assert.equal(status, expectedStatus);
      });

      it("it calls setAvailible with the order's ids", () => {
        checkIn._execute({ userId: 1 }, { orderId: mockOrderId });
        sinon.assert.calledWith(setAvailibleStub, {
          itemIds: newMockOrder.productIds,
          isAvailible: true,
        });
      });
    });
  });
});

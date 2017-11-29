/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';

import { Order } from './../../../order';
import { submitOrder } from './../index';
import { setAvailible } from './../../../../ItemDesc/methods/setAvailible/index';

describe('Order', () => {
  describe('methods', () => {
    describe('submitOrder()', () => {
      let meteorCallStub;
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
        Order.insert(newMockOrder);
        meteorCallStub = sinon.stub(Meteor, 'call');
        meteorCallStub.withArgs('cart.read.productIds').returns(['1', '2']);
        setAvailibleStub = sinon.stub(setAvailible, 'call');
      });

      afterEach(() => {
        Meteor.call.restore();
        setAvailible.call.restore();
      });

      it('inserts an order into the collection', () => {
        const newOrder = {
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          isPickUp: true,
          specialInstr: 'Drop that beat!',
        };

        submitOrder._execute({ userId: 1 }, newOrder, (error) => {
          if (!error) {
            assert.equal(Order.find().count(), 2);
          }
        });
      });

      it("calls 'setAvailible'", () => {
        const newOrder = {
          dateToArriveBy: new Date(),
          dateToShipBack: new Date(),
          isPickUp: true,
          specialInstr: 'Drop that beat!',
        };

        submitOrder._execute({ userId: 1 }, newOrder);

        assert.isTrue(setAvailibleStub.called);
      });
    });
  });
});

/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';

import { Payment } from './payment';

describe('Payment Class', () => {
  const testSecret = 'sssshhhhhhhhhhhh';
  let testPayment;
  beforeEach(() => {
    testPayment = new Payment(testSecret);
  });

  describe('functions', () => {
    describe('createHash', () => {
      it('throws error if amountDue is not defined', () => {
        assert.throws(() => testPayment.createHash(undefined, 1, 2, 3, 4), Error, 'amountDue');
      });
      it('throws error if orderNumber is not defined', () => {
        assert.throws(() => testPayment.createHash(1, undefined, 2, 3, 4), Error, 'orderNumber');
      });

      it('throws error if orderType is not defined', () => {
        assert.throws(() => testPayment.createHash(1, 2, undefined, 3, 4), Error, 'orderType');
      });

      it('throws error if paymentMethod is not defined', () => {
        assert.throws(() => testPayment.createHash(1, 2, 3, undefined, 4), Error, 'paymentMethod');
      });

      it('throws error if timestamp is not defined', () => {
        assert.throws(() => testPayment.createHash(1, 2, 3, 4, undefined), Error, 'timestamp');
      });

      // it('returns a hash', () => {
      //   const orderNumber = '1234';
      //   const timestamp = '1234567890000';
      //   const amountDue = 100.0;
      //   assert.equal(
      //     testPayment.createHash(orderNumber, timestamp, amountDue),
      //     md5(`${orderNumber}Library${timestamp}${amountDue}${testSecret}`),
      //   );
      // });
    });
    describe('createUrl', () => {
      it('throws an error if amountDue is not defined', () => {
        assert.throws(() => testPayment.createUrl(undefined, 1), Error, 'amountDue');
      });
      it('throws an error if orderNumber is not defined', () => {
        assert.throws(() => testPayment.createUrl(50, undefined), Error, 'orderNumber');
      });

      it('returns a url with correct params', () => {
        const isSubStr = (parentStr, subStr) => parentStr.indexOf(subStr) !== -1;
        const amountDue = '50'; // Cents
        const orderNumber = '1';
        const timestamp = Date.now();
        const paymentMethod = 'cc';
        const { settings: { private: { payment: { orderType } } } } = Meteor;

        const actualUrl = testPayment.createUrl(amountDue, orderNumber, timestamp);
        const noHashUrl = `${Meteor.settings.private.payment
          .endpoint}orderNumber=${orderNumber}&orderType=${orderType}&amountDue=${amountDue}&paymentMethod=${paymentMethod}&timestamp=${timestamp}`;

        // console.log(actualUrl);
        assert.isTrue(isSubStr(actualUrl, noHashUrl));
      });
    });
  });
});

/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import md5 from 'md5';

import { Payment } from './../payment';

describe('Payment Class', () => {
  let testPayment;
  beforeEach(() => {
    testPayment = new Payment();
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

      it('throws error if redirectUrl is not defined', () => {
        assert.throws(() => testPayment.createHash(1, 2, 3, 4, undefined), Error, 'redirectUrl');
      });
      it('throws error if redirectUrlParameters is not defined', () => {
        assert.throws(
          () => testPayment.createHash(1, 2, 3, 4, 5, undefined),
          Error,
          'redirectUrlParameters',
        );
      });
      it('throws error if retriesAllowed is not defined', () => {
        assert.throws(
          () => testPayment.createHash(1, 2, 3, 4, 5, 6, undefined),
          Error,
          'retriesAllowed',
        );
      });

      it('throws error if timestamp is not defined', () => {
        assert.throws(
          () => testPayment.createHash(1, 2, 3, 4, 5, 6, 7, undefined),
          Error,
          'timestamp',
        );
      });

      it('returns a hash', () => {
        const amountDue = '1';
        const orderNumber = '1';
        const orderType = '1';
        const paymentMethod = '1';
        const redirectUrl = '1';
        const redirectUrlParameters = '1';
        const retriesAllowed = '1';
        const timestamp = '1';

        assert.equal(
          testPayment.createHash(
            amountDue,
            orderNumber,
            orderType,
            paymentMethod,
            redirectUrl,
            redirectUrlParameters,
            retriesAllowed,
            timestamp,
          ),
          md5(orderNumber +
              orderType +
              amountDue +
              paymentMethod +
              redirectUrlParameters +
              retriesAllowed +
              timestamp +
              Meteor.settings.private.payment.secret),
        );
      });
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
        const redirectUrlParameters = 'none';
        const retriesAllowed = '2';
        const { settings: { private: { payment: { orderType } } } } = Meteor;

        const actualUrl = testPayment.createUrl(amountDue, orderNumber, timestamp);
        const noHashUrl = `${Meteor.settings.private.payment
          .endpoint}orderNumber=${orderNumber}&orderType=${orderType}&amountDue=${amountDue}&paymentMethod=${paymentMethod}&redirectUrlParameters=${redirectUrlParameters}&retriesAllowed=${retriesAllowed}&timestamp=${timestamp}`;

        // console.log(actualUrl);
        assert.isTrue(isSubStr(actualUrl, noHashUrl));
      });
    });
  });
});

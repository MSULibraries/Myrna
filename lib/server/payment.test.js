/* eslint-env mocha */

import md5 from 'md5';
import { assert } from 'meteor/practicalmeteor:chai';

import { Payment } from './../payment';

describe('Payment Class', () => {
  const testSecret = 'sssshhhhhhhhhhhh';
  let testPayment;
  beforeEach(() => {
    testPayment = new Payment(testSecret);
  });

  describe('functions', () => {
    describe('createHash', () => {
      it('throws error if orderNumber is not defined', () => {
        assert.throws(() => testPayment.createHash(undefined), Error, 'orderNumber');
      });

      it('returns a hash', () => {
        const orderNumber = '1234';
        const timestamp = Date.now();
        assert.equal(
          testPayment.createHash(orderNumber, timestamp),
          md5(orderNumber, timestamp, testSecret),
        );
      });
    });
    describe('createUrl', () => {
      it('throws an error if orderNumber is not defined', () => {
        const badOrderObj = {
          orderNumber: undefined,
          timestamp: '1509045883929',
          hash: 'hashslingingslasher',
        };
        assert.throws(() => testPayment.createUrl(badOrderObj), Error, 'orderNumber');
      });

      it('throws an error if timestamp is not defined', () => {
        const badOrderObj = {
          orderNumber: '1234452345',
          timestamp: undefined,
          hash: 'hashslingingslasher',
        };
        assert.throws(() => testPayment.createUrl(badOrderObj), Error, 'timestamp');
      });

      it('throws an error if hash is not defined', () => {
        const badOrderObj = {
          orderNumber: '1234452345',
          timestamp: '65468732132165',
          hash: undefined,
        };
        assert.throws(() => testPayment.createUrl(badOrderObj), Error, 'hash');
      });
      it('returns a url with correct params', () => {
        const goodOrderObj = {
          orderNumber: '1',
          timestamp: '1509045883929',
          hash: 'hashslingingslasher',
        };

        assert.equal(
          testPayment.createUrl(goodOrderObj),
          `${testPayment.paymentEndpoint}orderNumber=${goodOrderObj.orderNumber}&timestamp=${goodOrderObj.timestamp}&hash=${goodOrderObj.hash}`,
        );
      });
    });
  });
});

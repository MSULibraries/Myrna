/* eslint-env mocha */

import { assert } from 'meteor/practicalmeteor:chai';
import moment from 'moment';
import md5 from 'md5';

import { Payment } from './../payment';

describe('Payment Class', () => {
  let testPayment;
  beforeEach(() => {
    testPayment = new Payment();
  });

  describe('functions', () => {
    describe('createPaymentHash', () => {
      it('throws error if amountDue is not defined', () => {
        assert.throws(() => testPayment.createPaymentHash(undefined), Error, 'amountDue');
      });
      it('throws error if orderNumber is not defined', () => {
        assert.throws(() => testPayment.createPaymentHash(1, undefined, 2), Error, 'orderNumber');
      });
      it('throws error if timestamp is not defined', () => {
        assert.throws(() => testPayment.createPaymentHash(1, 2, undefined), Error, 'timestamp');
      });

      it('returns a hash', () => {
        const amountDue = '1';
        const orderNumber = '1';
        const timestamp = '1';
        const { settings: { private: { payment: { orderType } } } } = Meteor;
        const { settings: { private: { payment: { paymentMethod } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrl } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrlParameters } } } } = Meteor;

        assert.equal(
          testPayment.createPaymentHash(amountDue, orderNumber, timestamp),
          md5(orderNumber +
              orderType +
              amountDue +
              paymentMethod +
              redirectUrl +
              redirectUrlParameters +
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

      it('returns a url with correct params with even dollar amount', async () => {
        const isSubStr = (parentStr, subStr) => parentStr.indexOf(subStr) !== -1;
        let amountDue = 30.0;
        const amountDueInCents = 3000;
        const orderNumber = '1';
        const timestamp = Date.now();
        const { settings: { private: { payment: { orderType } } } } = Meteor;
        const { settings: { private: { payment: { paymentMethod } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrl } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrlParameters } } } } = Meteor;
        const actualUrl = await testPayment.createUrl(amountDue, orderNumber, timestamp);

        amountDue *= 100;

        const noHashUrl = `${Meteor.settings.private.payment.endpoint}orderNumber=${
          orderNumber
        }&orderType=${orderType}&amountDue=${amountDueInCents}&paymentMethod=${
          paymentMethod
        }&redirectUrl=${redirectUrl}&redirectUrlParameters=${redirectUrlParameters}&timestamp=${
          timestamp
        }`;

        assert.isTrue(isSubStr(actualUrl, noHashUrl));
      });
      it('returns a url with correct params with dollar amount', async () => {
        const isSubStr = (parentStr, subStr) => parentStr.indexOf(subStr) !== -1;
        let amountDue = 30.51;
        const amountDueInCents = 3051;
        const orderNumber = '1';
        const timestamp = Date.now();
        const { settings: { private: { payment: { orderType } } } } = Meteor;
        const { settings: { private: { payment: { paymentMethod } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrl } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrlParameters } } } } = Meteor;
        const actualUrl = await testPayment.createUrl(amountDue, orderNumber, timestamp);

        // Converting dollar amount to cents
        amountDue *= 100;

        const noHashUrl = `${Meteor.settings.private.payment.endpoint}orderNumber=${
          orderNumber
        }&orderType=${orderType}&amountDue=${amountDueInCents}&paymentMethod=${
          paymentMethod
        }&redirectUrl=${redirectUrl}&redirectUrlParameters=${redirectUrlParameters}&timestamp=${
          timestamp
        }`;

        assert.isTrue(isSubStr(actualUrl, noHashUrl));
      });
      it('returns a url with correct params with cent amount', async () => {
        const isSubStr = (parentStr, subStr) => parentStr.indexOf(subStr) !== -1;
        const amountDue = 0.5;
        const amountDueInCents = 50;
        const orderNumber = '1';
        const timestamp = Date.now();

        const { settings: { private: { payment: { orderType } } } } = Meteor;
        const { settings: { private: { payment: { paymentMethod } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrl } } } } = Meteor;
        const { settings: { private: { payment: { redirectUrlParameters } } } } = Meteor;

        const actualUrl = await testPayment.createUrl(amountDue, orderNumber, timestamp);
        const noHashUrl = `${Meteor.settings.private.payment.endpoint}orderNumber=${
          orderNumber
        }&orderType=${orderType}&amountDue=${amountDueInCents}&paymentMethod=${
          paymentMethod
        }&redirectUrl=${redirectUrl}&redirectUrlParameters=${redirectUrlParameters}&timestamp=${
          timestamp
        }`;

        assert.isTrue(isSubStr(actualUrl, noHashUrl));
      });
    });

    describe('validateHash', () => {
      it("returns 'true' if is a valid hash", () => {
        const { settings: { private: { payment: { secret } } } } = Meteor;

        const payloadItems = { timestamp: moment().subtract(1, 'minute') };

        let payload = '';
        Object.keys(payloadItems).forEach((key) => {
          payload += payloadItems[key];
        });
        payload += secret;
        const validHash = md5(payload);
        const isActualHash = testPayment.validateHash(payloadItems, validHash);
        assert.isTrue(isActualHash);
      });

      it("returns 'false' if bad hash", () => {
        const payloadItems = { timestamp: moment().subtract(1, 'minute') };
        const secret = 'someMadeUpSecret';
        let payload = '';
        Object.keys(payloadItems).forEach((key) => {
          payload += payloadItems[key];
        });
        payload += secret;
        const validHash = md5(payload);
        const isActualHash = testPayment.validateHash(payloadItems, validHash);
        assert.isFalse(isActualHash);
      });

      it("returns 'false' if timestamp is older than 5 minutes", () => {
        const payloadItems = { timestamp: moment().subtract(6, 'minutes') };
        const { settings: { private: { payment: { secret } } } } = Meteor;
        let payload = '';
        Object.keys(payloadItems).forEach((key) => {
          payload += payloadItems[key];
        });
        payload += secret;
        const validHash = md5(payload);
        const isActualHash = testPayment.validateHash(payloadItems, validHash);
        assert.isFalse(isActualHash);
      });

      it("returns 'false' if timestamp is from THE FUTTTTUUURREE", () => {
        const payloadItems = { timestamp: moment().add(1, 'minutes') };
        const { settings: { private: { payment: { secret } } } } = Meteor;
        let payload = '';
        Object.keys(payloadItems).forEach((key) => {
          payload += payloadItems[key];
        });
        payload += secret;
        const validHash = md5(payload);
        const isActualHash = testPayment.validateHash(payloadItems, validHash);
        assert.isFalse(isActualHash);
      });
    });
  });
});

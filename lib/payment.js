/**
 * Class for interfacing with the payment system
 */
import md5 from 'md5';
import moment from 'moment';
import { round } from 'lodash';

export class Payment {
  constructor() {
    this.paymentEndpoint = process.env.PAYMENT_ENDPOINT;
    this.secret = process.env.PAYMENT_SECRET;
  }

  /**
   * Generates hash for NelNet payment. The order of the parameters matters.
   */
  createPaymentHash(amountDue, orderNumber, timestamp) {
    if (!amountDue) {
      throw new Error('amountDue param must be defined');
    }
    if (!orderNumber) {
      throw new Error('orderNumber param must be defined');
    }

    if (!timestamp) {
      throw new Error('timestamp param must be defined');
    }

    const orderType = process.env.ORDER_TYPE;
    const paymentMethod = process.env.PAYMENT_METHOD;
    const redirectUrl = process.env.REDIRECT_URL;
    const redirectUrlParameters = process.env.REDIRECT_URL_PARAMETERS;

    /**
     * The payment API expects the variables to be in this order
     */
    return md5(orderNumber +
        orderType +
        amountDue +
        paymentMethod +
        redirectUrl +
        redirectUrlParameters +
        timestamp +
        this.secret);
  }

  createUrl(amountDue, orderNumber, timestamp) {
    /* eslint-disable no-param-reassign */

    if (!amountDue) {
      throw new Error('Error: amountDue is a required key/value');
    }
    if (!orderNumber) {
      throw new Error('Error: orderNumber is a required key/value');
    }

    /**
     * This is a specific name given to use from the payment folks
     * It must match what they have given us
     */
    const orderType = process.env.ORDER_TYPE;
    const paymentMethod = process.env.PAYMENT_METHOD;
    const redirectUrl = process.env.REDIRECT_URL;
    const redirectUrlParameters = process.env.REDIRECT_URL_PARAMETERS;

    const centsDue = this.dollarsToCents(amountDue);

    const hash = this.createPaymentHash(centsDue, orderNumber, timestamp);

    const url = `${
      this.paymentEndpoint
    }orderNumber=${orderNumber}&orderType=${orderType}&amountDue=${centsDue}&paymentMethod=${paymentMethod}&redirectUrl=${redirectUrl}&redirectUrlParameters=${redirectUrlParameters}&timestamp=${timestamp}&hash=${hash}`;

    return url;
  }

  /**
   * Converts a dollar amount to even cents
   * @param {Number} amountDue
   */
  dollarsToCents(amountDue) {
    if (!amountDue) {
      throw new Error("Error: amountDue is required for Payment class's 'dollarsToCents'");
    }

    return round(amountDue * 100, 0);
  }

  /**
   * Takes in parameters and md5 hashes them
   * returns whether what is sent matches what gets hashed
   * @param {Object} params - has atleast a 'timestamp'
   * @returns {Bool}
   */
  validateHash(params, hash) {
    /**
     * Returns true if object has a timestamp key
     * @param {Object} obj
     * @returns {Bool}
     */
    const hasTimestampProperty = obj => Object.prototype.hasOwnProperty.call(obj, 'timestamp');

    /**
     * Returns true if the timestamp is not older than 5 minutes
     * @param {String} timestamp
     * @returns {Bool}
     */
    const is5MinutesOld = timestamp =>
      moment(timestamp, 'x').isBefore(moment().subtract(5, 'minutes'));

    /**
     * Return false if timestamp is in THE FUTUUUURRRRE
     * @param {String} timestamp
     * @returns {Bool}
     */
    const isFromFuture = timestamp => moment(timestamp, 'x').isAfter(moment());

    if (
      hasTimestampProperty(params) &&
      !is5MinutesOld(params.timestamp) &&
      !isFromFuture(params.timestamp)
    ) {
      let payload = '';

      Object.keys(params).forEach((key) => {
        payload += params[key];
      });
      payload += this.secret;
      return hash === md5(payload);
    }
    return false;
  }
}

export default Payment;

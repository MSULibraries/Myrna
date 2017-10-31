/**
 * Class for interfacing with the payment system
 */
import md5 from 'md5';

export class Payment {
  constructor() {
    this.paymentEndpoint = Meteor.settings.private.payment.endpoint;
    this.secret = Meteor.settings.private.payment.secret;
  }

  /**
   * Generates hash for NelNet payment. The order of the parameters matters. The
   */
  createHash(amountDue, orderNumber, orderType, paymentMethod, timestamp) {
    if (!amountDue) {
      throw new Error('amountDue param must be defined');
    }
    if (!orderNumber) {
      throw new Error('orderNumber param must be defined');
    }
    if (!orderType) {
      throw new Error('orderType param must be defined');
    }
    if (!paymentMethod) {
      throw new Error('paymentMethod param must be defined');
    }
    if (!timestamp) {
      throw new Error('timestamp param must be defined');
    }

    /**
     * The payment API expects the variables to be in this order
     */
    return md5(orderNumber + orderType + amountDue + paymentMethod + timestamp + this.secret);
  }

  createUrl(amountDue, orderNumber, timestamp) {
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
    const { settings: { private: { payment: { orderType } } } } = Meteor;
    const paymentMethod = 'cc';
    // const redirectUrl = ""; URL to redirect to after payment

    const hash = this.createHash(amountDue, orderNumber, orderType, paymentMethod, timestamp);

    const url = `${this
      .paymentEndpoint}orderNumber=${orderNumber}&orderType=${orderType}&amountDue=${amountDue}&paymentMethod=${paymentMethod}&timestamp=${timestamp}&hash=${hash}`;

    return url;
  }
}

export default Payment;

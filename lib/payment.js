/**
 * Class for interfacing with the payment system
 */

const md5 = require('md5');

export class Payment {
  constructor(secret) {
    this.orderType = 'Library';
    this.testPaymentEndpoint = Meteor.settings.public.payment.TEST_PAYMENT_ENDPOINT;
    this.paymentEndpoint = this.testPaymentEndpoint;
    this.secret = secret;
  }

  /**
   * Generates hash for NelNet payment. The order of the parameters matters. The
   * @param {String} orderName
   * @param {String} timestamp
   * @param {String | undefined} orderNumber
   * @param {String | undefined} orderType
   * @param {String | undefined} orderDescription
   * @param {Number | undefined} amountDue - Cents, no decimal
   * @param {Number | undefined} balance - Cents, no decimal
   * @param {Number | undefined} currentAmountDue - Cents, no decimal
   * @param {Number | undefined} currentBalance - Cents, no decimal
   * @param {String | undefined} dueDate
   * @param {String | undefined} userChoice1
   * @param {String | undefined} userChoice2
   * @param {String | undefined} userChoice3
   * @param {String | undefined} userChoice4
   * @param {String | undefined} userChoice5
   * @param {String | undefined} userChoice6
   * @param {String | undefined} userChoice7
   * @param {String | undefined} userChoice8
   * @param {String | undefined} userChoice9
   * @param {String | undefined} userChoice10
   * @param {String | undefined} paymentMethod
   * @param {String | undefined} streetOne
   * @param {String | undefined} streetTwo
   * @param {String | undefined} city
   * @param {String | undefined} state
   * @param {String | undefined} zip
   * @param {String | undefined} country
   * @param {String | undefined} dayTimePhone
   * @param {String | undefined} nightTimePhone
   * @param {String | undefined} email
   * @param {String | undefined} redirectUrl
   * @param {String | undefined} redirectUrlParameters
   * @param {String | undefined} retriesAllowed
   *
   */
  createHash(
    orderNumber = '',
    timestamp = Date.now(),
    orderType = '',
    orderName = '',
    orderDescription = '',
    amountDue = '',
    balance = '',
    currentAmountDue = '',
    currentBalance = '',
    dueDate = '',
    userChoice1 = '',
    userChoice2 = '',
    userChoice3 = '',
    userChoice4 = '',
    userChoice5 = '',
    userChoice6 = '',
    userChoice7 = '',
    userChoice8 = '',
    userChoice9 = '',
    userChoice10 = '',
    paymentMethod = '',
    streetOne = '',
    streetTwo = '',
    city = '',
    state = '',
    zip = '',
    country = '',
    dayTimePhone = '',
    nightTimePhone = '',
    email = '',
    redirectUrl = '',
    redirectUrlParameters = '',
    retriesAllowed = '',
  ) {
    if (orderNumber === '') {
      throw new Error('orderNumber param must be defined');
    }
    /**
     * The payment API expects the variables to be in this order
     */
    return md5(
      orderNumber,
      orderType,
      orderName,
      orderDescription,
      amountDue,
      balance,
      currentAmountDue,
      currentBalance,
      dueDate,
      userChoice1,
      userChoice2,
      userChoice3,
      userChoice4,
      userChoice5,
      userChoice6,
      userChoice7,
      userChoice8,
      userChoice9,
      userChoice10,
      paymentMethod,
      streetOne,
      streetTwo,
      city,
      state,
      zip,
      country,
      dayTimePhone,
      nightTimePhone,
      email,
      redirectUrl,
      redirectUrlParameters,
      retriesAllowed,
      timestamp,
      this.secret,
    );
  }

  /**
   *@param {Object} orderObj
   * @example {
   *  orderNumber = '',
   *  orderType = '',
   *  orderName = '',
   *  orderDescription = '',
   *  amountDue = '',
   *  balance = '',
   *  currentAmountDue = '',
   *  currentBalance = '',
   *  dueDate = '',
   *  userChoice1 = '',
   *  userChoice2 = '',
   *  userChoice3 = '',
   *  userChoice4 = '',
   *  userChoice5 = '',
   *  userChoice6 = '',
   *  userChoice7 = '',
   *  userChoice8 = '',
   *  userChoice9 = '',
   *  userChoice10 = '',
   *  paymentMethod = '',
   *  streetOne = '',
   *  streetTwo = '',
   *  city = '',
   *  state = '',
   *  zip = '',
   *  country = '',
   *  dayTimePhone = '',
   *  nightTimePhone = '',
   *  email = '',
   *  redirectUrl = '',
   *  redirectUrlParameters = '',
   *  retriesAllowed = '',
   *  timestamp = '',
   * }
   */
  createUrl(orderObj) {
    if (!orderObj.orderNumber) {
      throw new Error('Error: orderNumber is a required key/value');
    }
    if (!orderObj.timestamp) {
      throw new Error('Error: timestamp is a required key/value');
    }
    if (!orderObj.hash) {
      throw new Error('Error: hash is a required key/value');
    }

    let url = this.paymentEndpoint;
    const keys = Object.keys(orderObj);

    keys.forEach((param, index, params) => {
      if (index < params.length - 1) {
        url += `${param}=${orderObj[param]}&`;
      } else {
        url += `${param}=${orderObj[param]}`;
      }
    });
    return url;
  }
}

export default Payment;

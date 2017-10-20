/**
 * Interface for EasyPost API for shipping
 *
 * Guide:
 * https://www.easypost.com/getting-started/node.html#step1
 *
 * Docs:
 * https://www.easypost.com/docs/api#shipments
 */

import Easypost from '@easypost/api';

export class EasyPostInterface {
  constructor() {
    this.api = new Easypost(Meteor.settings.public.EASYPOST_TEST_API_KEY);
  }

  /**
     * Creates and saves a to address
     */
  createToAddress({
    company, street1, city, state, zip,
  }) {
    const toAddress = new this.api.Address({
      company,
      street1,
      city,
      state,
      zip,
    });

    toAddress.save();
  }

  /**
     * Creates and saves a from address
     */
  createFromAddress() {
    // Defaulting to library PO box for now
    const library = {
      company: 'MSU Libraries',
      street1: 'PO Box 5408',
      city: 'Starkville',
      state: 'Mississippi',
      zip: '39759',
    };

    const fromAddress = new this.api.Address({
      company: library.company,
      street1: library.street1,
      city: library.city,
      state: library.state,
      zip: library.zip,
    });

    fromAddress.save();
  }

  /**
     * Creates and saves a parcel
     */
  // createParcel() {}

  /**
     * Creates and saves a shipment
     */
  // createShipment() {}

  /**
     * Buys a shipment
     */
  // buyShipment() {}
}
export default EasyPostInterface;

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
  // createToAddress() {}

  /**
     * Creates and saves a from address
     */
  // createFromAddress() {}

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

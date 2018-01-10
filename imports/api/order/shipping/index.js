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
import dotenv from 'dotenv';

dotenv.config({ path: `${process.env.PWD}/.env` });
export class EasyPostInterface {
  constructor() {
    if (Meteor.isServer) {
      this.api = new Easypost(process.env.EASYPOST_TEST_API_KEY);
    }
  }

  /**
   * Finds the shipmentId attached to an order
   * Buys the shipment with that shipment Id
   * @example - https://www.easypost.com/docs/api/node.html#shipments-buy-codesample
   * @param {String} orderId
   */
  async buyShipment(shipmentId) {
    let shipment = await this.api.Shipment.retrieve(shipmentId);
    shipment = await shipment.buy(shipment.lowestRate());
    return shipment;
  }

  /**
   * Creates and saves a to address
   */
  createToAddress(company, street1, city, state, zip) {
    const toAddress = new this.api.Address({
      company,
      street1,
      city,
      state,
      zip,
    });

    return toAddress.save();
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

    return fromAddress.save();
  }

  /**
   * Creates and saves a parcel
   */
  createParcel({
    length, width, height, weight,
  }) {
    const parcel = new this.api.Parcel({
      length,
      width,
      height,
      weight,
    });

    return parcel.save();
  }

  /**
   * Creates and saves a shipment
   */
  createShipment(fromAddress, toAddress, parcel) {
    const shipment = new this.api.Shipment({
      to_address: toAddress,
      from_address: fromAddress,
      parcel,
    });

    return shipment.save();
  }
}
export default EasyPostInterface;

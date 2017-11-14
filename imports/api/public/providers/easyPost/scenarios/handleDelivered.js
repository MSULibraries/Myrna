/* eslint-disable consistent-return */

const handler = ({ shipment_id: shipmentId }) => {
  try {
    // Getting the orderId for the shipment that the webhook is talking about
    const orderId = Meteor.call('order.trackingId.read.orderId', shipmentId);
    // Updating the order  status to 'delivered'
    Meteor.call('order.delivered', orderId);
  } catch (exception) {
    /* eslint-disable  no-console */

    console.error(exception);
  }
};

export const handleDelivered = data => handler(data);

export default handleDelivered;

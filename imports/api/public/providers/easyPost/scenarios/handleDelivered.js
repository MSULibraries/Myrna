/* eslint-disable consistent-return */

const handler = (data, promise) => {
  try {
    promise.resolve(data);
  } catch (exception) {
    promise.reject(`[trackerUpdatedHandler.handler] ${exception}`);
  }
};

export const handleDelivered = data => handler(data);

export default handleDelivered;

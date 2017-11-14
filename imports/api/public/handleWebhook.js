/* eslint-disable consistent-return */
import { easyPostHandler } from './providers/easyPost/index';

const providers = {
  easypost: easyPostHandler,
};

const handler = ({ provider, request }, promise) => {
  try {
    const targetProvider = providers[provider];
    if (targetProvider) targetProvider({ body: request.body }, promise);
    promise.resolve('Webhook received!');
  } catch (exception) {
    promise.reject(`[handleWebhook.handler] ${exception}`);
  }
};

export const handleWebhook = options =>
  new Promise((resolve, reject) => handler(options, { resolve, reject }));

export default handleWebhook;

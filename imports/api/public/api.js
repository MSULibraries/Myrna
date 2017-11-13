/**
 * Holds server side endpoints for webhooks
 */

/* eslint-disable no-param-reassign, no-console */

import bodyParser from 'body-parser';
import { Picker } from 'meteor/meteorhacks:picker';
import { handleWebhook } from './handleWebhook.js';

Picker.middleware(bodyParser.json());

Picker.route('/api/webhooks/:provider', ({ provider }, request, response) => {
  handleWebhook({ provider, request })
    .then((result) => {
      response.statusCode = 200;
      response.end(result);
    })
    .catch((error) => {
      console.warn(error);
      response.statusCode = 500;
      response.end(error);
    });
});

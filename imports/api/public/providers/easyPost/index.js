/* eslint-disable consistent-return */

import { Meteor } from 'meteor/meteor';
import { handleDelivered } from './scenarios/handleDelivered';

const scenarios = {
  delivered: data => handleDelivered(data),
};

const handler = ({ body }, promise) => {
  try {
    const { result } = body;
    const scenario = scenarios[result.status];
    if (scenario) scenario(result, promise);
  } catch (exception) {
    throw new Meteor.Error('500', `[easyPostHandler.handler] ${exception}`);
  }
};

export const easyPostHandler = options => handler(options);

export default easyPostHandler;

import * as email from 'meteor/email';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { LoggedInMixin } from 'meteor/tunifight:loggedin-mixin';

export const emailOrderedDelivered = new ValidatedMethod({
  name: 'order.emails.orderDelivered',
  mixins: [LoggedInMixin],
  checkLoggedInError: {
    error: 'notLogged',
    message:
      'Error in emailOrderedDelivered() : You must be logged in to send the orderDelivered email',
  },
  validate: () => {},

  run() {
    if (!this.isSimulation) {
      /**
       *  Stopping actual email from being sent until we are
       *  allowed to  send email
       */
      if (Meteor.isTest) {
        email.default.Email.send({
          from: 'broabect@ut.utm.edu',
          to: 'broabect@ut.utm.edu',
          subject: 'Myrna Costume Order Delivered | Myrna Colley Lee Costume Collection',
          text: 'Your order has been delivered!',
        });
      }
    }
  },
});

export default emailOrderedDelivered;

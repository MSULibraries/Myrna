import * as email from 'meteor/email';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Order } from './../../../order';

export const emailOrderedPlaced = new ValidatedMethod({
  name: 'order.emails.orderPlaced',
  mixins: [],
  validate: new SimpleSchema({
    orderId: { type: SimpleSchema.RegEx.Id },
  }).validator(),

  run({ orderId }) {
    if (!this.isSimulation) {
      // Getting the orders details
      const usersOrder = Order.findOne({ _id: orderId });

      // If there is an order with the id of orderId
      if (usersOrder !== undefined) {
        // Getting users email
        const orderOwner = Meteor.users.findOne({ _id: usersOrder.userId });
        const { address: userEmail } = orderOwner.emails[0];

        /**
         *  Stopping actual email from being sent until we are
         *  allowed to send email
         */
        if (Meteor.isProduction || Meteor.isTest) {
          email.default.Email.send({
            from: Meteor.settings.public.siteEmail,
            to: Meteor.settings.public.siteEmail,
            subject: 'Myrna Costume Order Placed | Myrna Colley Lee Costume Collection',
            text: `${userEmail} has placed an new order. Go to: costumes.library.msstate.edu/orders to review the order and 'Approve'`,
          });
        }
      }
    }
  },
});

export default emailOrderedPlaced;

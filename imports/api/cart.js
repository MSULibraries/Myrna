import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

import { userLoggedIn } from './../../lib/user';

export const Cart = new Mongo.Collection('cart');

Cart.allow({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  },
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('cart', () =>
    // Only return a user's cart items
    Cart.find({ userId: Meteor.userId() }));
}

Meteor.methods({
  'cart.clear': function cartClear() {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Cart.remove({ userId: Meteor.userId() });
  },

  'cart.count': function cartCount() {
    if (userLoggedIn()) {
      return Cart.find({ userId: Meteor.userId() }).count();
    }
    return 0;
  },

  /**
   * Returns array of ids of products in the cart
   */
  'cart.read': function cartRead() {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    const currentCartProductIds = Cart.find({ userId: Meteor.userId() }).fetch();
    return currentCartProductIds;
  },
  'cart.read.productIds': function cartReadProductIds() {
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    // Gets an array of string ids that are the product ids
    const currentCartProductIds = Cart.find(
      { userId: Meteor.userId() },
      {
        fields: { productId: 1 },
      },
    )
      .fetch()
      .map(item => item.productId);

    return currentCartProductIds;
  },
  'cart.insert': function cartInsert(productId) {
    // Checking Input Var Types
    check(productId, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const currentCartIds = Meteor.call('cart.read.productIds');

    // If the new product ID isn't alrighty in the cart
    if (!currentCartIds.includes(productId)) {
      Cart.insert({
        productId,
        userId: Meteor.userId(),
        dateAdded: Date.now(),
      });
    }
  },

  /**
   * Takes in an array of productIds and adds them to the cart
   * @param {Array} productIds
   */
  'cart.insert.productIds': function cartInsertProductIds(productIds) {
    // Checking Input Var Types
    check(productIds, Array);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const currentCartIds = Meteor.call('cart.read.productIds');
    const dateAdded = Date.now();
    const userId = Meteor.userId();

    // Inserting each productId
    productIds.forEach((productId) => {
      // If the new product ID isn't alrighty in the cart
      if (!currentCartIds.includes(productId)) {
        Cart.insert({
          productId,
          userId,
          dateAdded,
        });
      }
    });
  },

  'cart.remove': function cartRemove(cartEntryId) {
    check(cartEntryId, String);
    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }
    Cart.remove(cartEntryId);
  },
});

export default Cart;

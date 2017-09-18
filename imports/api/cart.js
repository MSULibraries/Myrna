import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Cart = new Mongo.Collection("cart");

Cart.allow({
  insert() {
    return true;
  },
  update() {
    return true;
  },
  remove() {
    return true;
  }
});

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("cart", function cartPublication() {
    //Only return a user's cart items
    return Cart.find({ userId: Meteor.userId() });
  });
}

Meteor.methods({
  "cart.insert"(productId) {
    //Checking Input Var Types
    check(productId, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Cart.insert({
      productId,
      userId: Meteor.userId(),
      dateAdded: Date.now()
    });
  },
  "cart.remove"(productId) {
    check(productId, String);

    Cart.remove(productId);
  }
});

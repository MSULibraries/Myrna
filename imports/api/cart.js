import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Cart = new Mongo.Collection("cart");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("cart", function cartPublication() {
    return Cart.find({});
  });
}

Meteor.methods({
  "cart.insert"(productId) {
    //Checking Input Var Types
    check(productId, Number);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Cart.insert({
      productId,
      customerId: Meteor.userId(),
      addedAt: new Date()
    });
  },
  "cart.remove"(productId) {
    check(productId, String);

    Cart.remove(productId);
  }
});

import { Meteor } from "meteor/meteor";
import { Mongo } from "meteor/mongo";
import { check } from "meteor/check";

export const Dresses = new Mongo.Collection("dresses");

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish("dresses", function dressesPublication() {
    return Dresses.find({});
  });
}

Meteor.methods({
  "dresses.insert"(
    arms,
    bust,
    collar,
    hips,
    insideSleeve,
    length,
    neckToEndOfTrain,
    neckToHem,
    oneSizeFitsMost,
    skirtLength,
    shoulders,
    shoulderToHem,
    waist,
    waistToHem
  ) {
    //Checking Input Var Types
    check(arms, Number);
    check(bust, Number);
    check(collar, Number);
    check(hips, Number);
    check(insideSleeve, Number);
    check(length, Number);
    check(neckToEndOfTrain, Number);
    check(neckToHem, Number);
    check(oneSizeFitsMost, Boolean);
    check(skirtLength, Number);
    check(shoulders, Number);
    check(shoulderToHem, Number);
    check(waist, Number);
    check(waistToHem, Number);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error("not-authorized");
    }

    Dresses.insert({
      arms,
      bust,
      collar,
      createdAt: new Date(),
      hips,
      insideSleeve,
      length,
      neckToEndOfTrain,
      neckToHem,
      oneSizeFitsMost,
      owner: Meteor.userId(),
      skirtLength,
      shoulders,
      shoulderToHem,
      waist,
      waistToHem
    });
  },
  "dresses.remove"(dressId) {
    check(dressId, String);

    Dresses.remove(dressId);
  }
});

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Addresses = new Mongo.Collection('addresses');

const addressSchema = new SimpleSchema({
  company: { type: String, label: 'company', optional: false },
  city: { type: String, label: 'city', optional: false },
  createdAt: { type: Date, label: 'createdAt', optional: false },
  name: { type: String, label: 'name', optional: false },
  owner: { type: String, label: 'owner', optional: false },
  street1: { type: String, label: 'street1', optional: false },
  state: { type: String, label: 'state', optional: false },
  zip: { type: String, label: 'zip', optional: false },
});

const addressContext = addressSchema.newContext();

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('addresses', () => Addresses.find({ userId: Meteor.userId() }));
}

Meteor.methods({
  'addresses.insert': function addressesInsert(name, company, street1, city, state, zip) {
    // Checking Input Var Types
    check(name, String);
    check(company, String);
    check(street1, String);
    check(city, String);
    check(state, String);
    check(zip, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    const newAddress = {
      city,
      company,
      createdAt: new Date(),
      name,
      owner: Meteor.userId(),
      street1,
      state,
      zip,
    };

    if (addressContext.isValid(newAddress)) {
      Addresses.insert(newAddress);
    }
  },
  'addresses.remove': function addressesRemove(addressId) {
    check(addressId, String);

    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    Addresses.remove(addressId);
  },
});

export default Addresses;
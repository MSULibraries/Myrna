import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const ItemDesc = new Mongo.Collection('itemDesc');

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('itemDesc', () => ItemDesc.find({}));
}

Meteor.methods({
  'itemDesc.insert': function itemDescInsert(
    oldId,
    name,
    description,
    costPerTimeframe,
    maxTimeframe,
    timeframe,
    category,
    minimumTimeframe,
    shippingRate,
    expectedReturn,
    uniqueIdentifier,
    itemStatus,
    shortDescription,
    discr,
    baseCost,
  ) {
    // Checking Input Var Types
    check(oldId, String);
    check(name, String);
    check(description, String);
    check(costPerTimeframe, String);
    check(maxTimeframe, String);
    check(timeframe, String);
    check(category, String);
    check(minimumTimeframe, String);
    check(shippingRate, String);
    check(expectedReturn, String);
    check(uniqueIdentifier, String);
    check(itemStatus, String);
    check(shortDescription, String);
    check(discr, String);
    check(baseCost, String);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    ItemDesc.insert({
      oldId,
      name,
      description,
      costPerTimeframe,
      maxTimeframe,
      timeframe,
      category,
      minimumTimeframe,
      shippingRate,
      expectedReturn,
      uniqueIdentifier,
      itemStatus,
      shortDescription,
      discr,
      baseCost,
    });
  },
  'itemDesc.remove': function itemDescRemove(descId) {
    check(descId, String);

    ItemDesc.remove(descId);
  },
  'itemDesc.paginate': function itemDescPaginate(
    offset,
    limit,
    clothingType = '',
    searchQuery = '',
  ) {
    check(offset, Number);
    check(limit, Number);

    if (clothingType !== '' && searchQuery === '') {
      const results = ItemDesc.find({ category: clothingType }, { skip: offset, limit }).fetch();
      if (results.length > 0) {
        return results;
      }
      return [];
    }
    return [ItemDesc.find({}, { offset, limit }).fetch()];
  },
});

export default ItemDesc;

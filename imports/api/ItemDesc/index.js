import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const ItemDesc = new Mongo.Collection('itemDesc');

const ItemDescSchema = new SimpleSchema({
  baseCost: {
    type: String,
    label: 'Legacy',
  },
  category: {
    type: String,
    label: 'Clothing Type',
  },
  costPerTimeframe: {
    type: String,
    label: 'Legacy',
  },
  discr: {
    type: String,
    label: 'Legacy',
  },
  description: {
    type: String,
    label: 'Description of the Piece',
  },
  expectedReturn: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
  isAvailible: {
    type: Boolean,
    label: 'Item is Availible to add to Cart',
    defaultValue: true,
  },
  itemStatus: {
    type: String,
    label: 'Condition of the Piece',
  },
  maxTimeframe: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
  minimumTimeframe: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
  name: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
  oldId: {
    type: String,
    label: 'Legacy ID of the product from Symfony',
    defaultValue: '',
  },
  shippingRate: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
  shortDescription: {
    type: String,
    label: 'Description of the Product',
  },
  timeframe: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
  uniqueIdentifier: {
    type: String,
    label: 'Legacy',
    defaultValue: '',
  },
});

ItemDesc.schema = ItemDescSchema;

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
    isAvailible,
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

    const newItemDesc = {
      oldId,
      name,
      description,
      costPerTimeframe,
      maxTimeframe,
      timeframe,
      isAvailible,
      category,
      minimumTimeframe,
      shippingRate,
      expectedReturn,
      uniqueIdentifier,
      itemStatus,
      shortDescription,
      discr,
      baseCost,
    };

    check(newItemDesc, ItemDescSchema);

    // Make sure the user is logged in before inserting a task
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized');
    }

    ItemDesc.insert(newItemDesc);
  },
  'itemDesc.remove': function itemDescRemove(descId) {
    check(descId, String);

    ItemDesc.remove(descId);
  },
  'itemDesc.paginate': function itemDescPaginate(
    offset,
    limit,
    clothingFilters = [],
    searchQuery = '',
  ) {
    check(offset, Number);
    check(limit, Number);

    let selector = {};

    if (clothingFilters.length > 0) {
      selector = { ...selector, category: { $in: clothingFilters } };
    }
    if (searchQuery !== '') {
      selector = { ...selector, shortDescription: { $regex: `.*${searchQuery}.*`, $options: 'i' } };
    }
    return ItemDesc.find(selector, { skip: offset, limit }).fetch();
  },
});

export default ItemDesc;

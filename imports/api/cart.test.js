/* eslint-env mocha */

import { Meteor } from 'meteor/meteor';
import { assert } from 'meteor/practicalmeteor:chai';
import { sinon } from 'meteor/practicalmeteor:sinon';
import { Random } from 'meteor/random';

import { Cart } from './cart';

if (Meteor.isServer) {
  describe('Cart', () => {
    describe('methods', () => {
      // Creating mock ids
      const userId = Random.id();
      const productId = Random.id();
      let mockCartInsertId;
      beforeEach(() => {
        // Stubbing soome of meteors global functions
        const userIdStub = sinon.stub(Meteor, 'userId');

        // stubbed userId will return our mock uid
        userIdStub.returns(userId);

        // clearing cart collection
        Cart.remove({});

        // Inserting a cart item
        mockCartInsertId = Cart.insert({
          productId,
          createdAt: new Date(),
          userId,
        });
      });

      afterEach(() => {
        // Unstubbing userId function
        Meteor.userId.restore();
      });

      it('cart.clear clears a users cart by uid', () => {
        const clearCart = Meteor.server.method_handlers['cart.clear'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        clearCart.apply(invocation, [userId]);

        assert.equal(Cart.find().count(), 0);
      });

      it('cart.read reads cart', () => {
        const readCart = Meteor.server.method_handlers['cart.read'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        const cartItems = readCart.apply(invocation, []);
        assert.deepEqual(Cart.find().fetch(), cartItems);
      });

      it('cart.remove removes', () => {
        const removeProductFromCart = Meteor.server.method_handlers['cart.remove'];
        const invocation = { userId };

        removeProductFromCart.apply(invocation, [mockCartInsertId]);
        assert.equal(Cart.find().count(), 0);
      });

      it('cart.read.productIds returns an array of productIds from cart', () => {
        const readCart = Meteor.server.method_handlers['cart.read.productIds'];
        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        const cartItemsIds = readCart.apply(invocation, []);
        const mockArrayOfProductIds = [productId];
        assert.deepEqual(mockArrayOfProductIds, cartItemsIds);
      });

      it('cart.insert inserts', () => {
        const insertCart = Meteor.server.method_handlers['cart.insert'];

        // Set up a fake method invocation that looks like what the method expects
        const invocation = { userId };

        insertCart.apply(invocation, [productId]);
        assert.equal(Cart.find().count(), 2);
      });
    });
  });
}

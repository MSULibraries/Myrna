import React, { Component } from "react";
import { Container } from "react-grid-system";
import { createContainer } from "meteor/react-meteor-data";

import { Cart } from "./../../../api/cart";

class CartPage extends Component {
  render() {
    return (
      <Container>
        <h1>Cart</h1>
      </Container>
    );
  }
}

export default (CartPage = createContainer(() => {
  Meteor.subscribe("cart");
  return {
    cartItems: Cart.find({ customerId: Meteor.userId() }).fetch()
  };
}, CartPage));

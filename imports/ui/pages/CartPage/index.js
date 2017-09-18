import React, { Component } from "react";
import PropTypes from "prop-types";
import { Container } from "react-grid-system";
import FlatButton from "material-ui/FlatButton";
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import { createContainer } from "meteor/react-meteor-data";

import { Cart } from "./../../../api/cart";

//Adjusted contrast to help with a11y
const darkerTableHeaders = {
  color: "#575757"
};

const alignCenter = {
  textAlign: "center"
};

const centerColumn = {
  display: "flex",
  alignItems: "center"
};

class CartPage extends Component {
  constructor() {
    super();

    this.removeProductFromCart = this.removeProductFromCart.bind(this);
  }

  removeProductFromCart(id) {
    Meteor.call("cart.remove", id);
  }

  render() {
    return (
      <Container>
        <h1>Cart</h1>

        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={darkerTableHeaders}>
                Product ID
              </TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>
                User ID
              </TableHeaderColumn>
              <TableHeaderColumn style={darkerTableHeaders}>
                Added On{" "}
              </TableHeaderColumn>

              <TableHeaderColumn style={{ darkerTableHeaders, ...alignCenter }}>
                Remove
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.props.cartItems.map(item => {
              return (
                <TableRow key={item._id}>
                  <TableRowColumn>{item.productId}</TableRowColumn>
                  <TableRowColumn>{item.userId}</TableRowColumn>
                  <TableRowColumn>{item.dateAdded}</TableRowColumn>
                  <TableRowColumn style={centerColumn}>
                    <FlatButton
                      onClick={() => this.removeProductFromCart(item._id)}
                      secondary
                      label="X"
                    />
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Container>
    );
  }
}

CartPage.defaultProps = {
  cartItems: []
};

CartPage.proptypes = {
  cartItems: PropTypes.array
};

export default (CartPage = createContainer(() => {
  Meteor.subscribe("cart");
  return {
    cartItems: Cart.find({}).fetch()
  };
}, CartPage));
